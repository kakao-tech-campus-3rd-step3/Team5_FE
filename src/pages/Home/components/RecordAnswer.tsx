import { useState, useRef, useEffect } from 'react';

import styled from '@emotion/styled';
import { Mic, Square, Upload, AlertCircle, Wifi, WifiOff } from 'lucide-react';

import { ACCESS_TOKEN_KEY } from '../../../shared/utils/auth';

interface RecordAnswerProps {
  onAnswerComplete?: (audioUrl: string, text?: string) => void;
  onError?: (error: string) => void;
}

// 설정 상수
const CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_RECORDING_TIME: 300000, // 5분
  UPLOAD_TIMEOUT: 60000, // 1분
  STT_TIMEOUT: 180000, // 3분
  MAX_RETRY_COUNT: 3,
  RECONNECT_DELAY: 1000,
};

// 상태 타입 정의
type RecordingState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'uploading'
  | 'pending_stt'
  | 'completed'
  | 'error';
type NetworkState = 'online' | 'offline' | 'checking';
type STTStatus = 'PENDING_STT' | 'COMPLETED' | 'FAILED_STT';

const RecordAnswer = ({ onAnswerComplete, onError }: RecordAnswerProps) => {
  // 상태 관리
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [networkState, setNetworkState] = useState<NetworkState>('online');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [convertedText, setConvertedText] = useState<string>('');
  const [sttStatus, setSTTStatus] = useState<STTStatus | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const uploadTimeoutRef = useRef<number | null>(null);
  const sttTimeoutRef = useRef<number | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // 오디오 데이터
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // SSE 연결 설정
  const connectSSE = () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      logInfo('SSE 연결 시도 시작');
      const eventSource = new EventSource(`/api/sse/connect?token=${token}`);
      sseRef.current = eventSource;

      eventSource.onopen = () => {
        logInfo('SSE 연결 성공');
        reconnectAttemptsRef.current = 0;
      };

      // STT 완료 이벤트
      eventSource.addEventListener('sttCompleted', (event) => {
        const data = JSON.parse(event.data);
        logInfo('STT 변환 완료', data);

        setConvertedText(data.text);
        setSTTStatus('COMPLETED');
        setRecordingState('completed');

        if (sttTimeoutRef.current) {
          clearTimeout(sttTimeoutRef.current);
        }

        if (onAnswerComplete) {
          onAnswerComplete(data.audioUrl);
        }
      });

      // STT 실패 이벤트
      eventSource.addEventListener('sttFailed', (event) => {
        const data = JSON.parse(event.data);
        logError('STT 변환 실패', new Error(data.message), data);

        setSTTStatus('FAILED_STT');
        setRecordingState('error');
        setErrorMessage('음성을 텍스트로 변환하는데 실패했습니다.');

        if (sttTimeoutRef.current) {
          clearTimeout(sttTimeoutRef.current);
        }
      });

      // SSE 에러 처리
      eventSource.onerror = (event) => {
        const errorMsg =
          eventSource.readyState === EventSource.CLOSED
            ? 'SSE 연결이 종료되었습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
            : 'SSE 연결 오류가 발생했습니다.';

        logError('SSE 연결 오류', new Error(errorMsg), {
          event,
          readyState: eventSource.readyState,
          url: eventSource.url,
        });
        eventSource.close();

        // 재연결 시도 (최대 2회로 제한하여 서버가 없을 때 무한 재시도 방지)
        const maxSSERetryCount = 2;
        if (reconnectAttemptsRef.current < maxSSERetryCount) {
          reconnectAttemptsRef.current++;
          setTimeout(() => {
            logInfo(`SSE 재연결 시도 ${reconnectAttemptsRef.current}/${maxSSERetryCount}`);
            connectSSE();
          }, CONFIG.RECONNECT_DELAY * reconnectAttemptsRef.current);
        } else {
          // 최종 실패 시 상태 조회 API 호출 (서버가 없어도 폴백)
          logInfo('SSE 연결 최종 실패 - 상태 조회 API로 폴백');
          if (answerId) {
            checkAnswerStatus(answerId);
          } else {
            setErrorMessage('실시간 연결에 실패했습니다. 상태 조회를 시도합니다.');
            // 상태 조회는 answerId가 필요하므로, 업로드가 완료된 후에만 가능
          }
        }
      };
    } catch (error) {
      logError('SSE 연결 실패', error, {});
      setErrorMessage('실시간 연결에 실패했습니다.');
    }
  };

  // 상태 조회 API
  const checkAnswerStatus = async (answerIdToCheck: string) => {
    try {
      const response = await fetch(`/api/answers/${answerIdToCheck}/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      });

      if (!response.ok) {
        throw new Error('상태 조회 실패');
      }

      const data = await response.json();
      logInfo('답변 상태 조회 결과', data);

      switch (data.status) {
        case 'PENDING_STT':
          // CLOVA 콜백이 아직 안 왔거나 누락된 상태 -> 실패로 간주
          setSTTStatus('FAILED_STT');
          setRecordingState('error');
          setErrorMessage('음성 변환이 지연되고 있습니다. 재시도해주세요.');
          break;

        case 'FAILED_STT':
          // STT 변환 실패 상태
          setSTTStatus('FAILED_STT');
          setRecordingState('error');
          setErrorMessage('음성 변환에 실패했습니다.');
          break;

        case 'COMPLETED':
          // STT 변환 성공 - SSE 알림만 놓친 상태
          setConvertedText(data.text);
          setSTTStatus('COMPLETED');
          setRecordingState('completed');

          if (onAnswerComplete) {
            onAnswerComplete(data.audioUrl);
          }
          break;

        default:
          setErrorMessage('알 수 없는 상태입니다.');
      }
    } catch (error) {
      logError('상태 조회 실패', error, { answerIdToCheck });
      setErrorMessage('연결 오류가 발생했습니다. 페이지를 새로고침해주세요.');
    }
  };

  // 1. 메모리 누수 방지 및 SSE 연결 관리 (필수)
  useEffect(() => {
    // SSE 연결은 실제로 필요할 때만 연결 (업로드 후)
    // 페이지 진입 시 자동 연결하지 않음
    // connectSSE();

    return () => {
      // 모든 타이머 정리
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
      if (sttTimeoutRef.current) clearTimeout(sttTimeoutRef.current);

      // SSE 연결 해제
      if (sseRef.current) {
        sseRef.current.close();
      }

      // 미디어 스트림 정리
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Blob URL 해제
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 2. 네트워크 오류 대응 (필수)
  useEffect(() => {
    const handleOnline = () => {
      setNetworkState('online');
      logInfo('네트워크 연결 복구됨');
    };

    const handleOffline = () => {
      setNetworkState('offline');
      setErrorMessage('네트워크 연결이 끊어졌습니다.');
      logError('네트워크 연결 끊김', new Error('Network offline'), {});
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 로깅 함수들
  const logError = (stage: string, error: any, context: any) => {
    console.error(`[AudioRecording] ${stage}:`, {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      retryCount,
    });
  };

  const logInfo = (message: string, data?: any) => {
    console.log(`[AudioRecording] ${message}`, data || '');
  };

  // 파일 크기 검증
  const validateFileSize = (blob: Blob): boolean => {
    if (blob.size > CONFIG.MAX_FILE_SIZE) {
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      const maxSizeMB = (CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      setErrorMessage(`파일 크기가 너무 큽니다. (${sizeMB}MB / 최대 ${maxSizeMB}MB)`);
      return false;
    }
    return true;
  };

  // 녹음 시작
  const startRecording = async () => {
    if (networkState === 'offline') {
      setErrorMessage('네트워크 연결을 확인해주세요.');
      return;
    }

    try {
      setRecordingState('recording');
      setErrorMessage('');
      setRecordingTime(0);
      audioChunksRef.current = [];

      // 마이크 접근
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      audioStreamRef.current = stream;

      // MediaRecorder 설정
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;

      // 녹음 데이터 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 완료 처리
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (!validateFileSize(blob)) {
          setRecordingState('error');
          return;
        }

        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingState('processing');

        logInfo('녹음 완료', {
          size: blob.size,
          duration: recordingTime,
          type: blob.type,
        });
      };

      // 녹음 시작
      mediaRecorder.start(1000); // 1초마다 데이터 수집

      // 녹음 시간 타이머
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1000;
          if (newTime >= CONFIG.MAX_RECORDING_TIME) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      logInfo('녹음 시작');
    } catch (error) {
      logError('녹음 시작 실패', error, { networkState });
      setRecordingState('error');
      setErrorMessage('마이크 접근 권한이 필요합니다.');
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('processing');

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      // 스트림 정리
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      logInfo('녹음 중지', { duration: recordingTime });
    }
  };

  // 3. 파일 업로드 (진행률 포함)
  const uploadWithProgress = async (preSignedUrl: string, file: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 업로드 진행률
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload network error'));
      xhr.ontimeout = () => reject(new Error('Upload timeout'));

      xhr.timeout = CONFIG.UPLOAD_TIMEOUT;
      xhr.open('PUT', preSignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  // 서버에 업로드
  const uploadToServer = async () => {
    if (!audioBlob) return;

    try {
      setRecordingState('uploading');
      setUploadProgress(0);

      // 1. Pre-signed URL 획득
      logInfo('Pre-signed URL 요청 시작');
      // 파일명 생성 (timestamp 기반)
      const fileName = `audio_${Date.now()}.webm`;
      const response = await fetch(
        `/api/answers/upload-url?fileName=${encodeURIComponent(fileName)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pre-signed URL 획득 실패: ${response.status} ${response.statusText}`);
      }

      const { preSignedUrl, finalAudioUrl: serverAudioUrl } = await response.json();
      logInfo('Pre-signed URL 획득 성공', { preSignedUrl, serverAudioUrl });

      // 2. 파일 업로드
      await uploadWithProgress(preSignedUrl, audioBlob);

      // 3. 답변 제출
      const submitResponse = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
        body: JSON.stringify({
          audioUrl: serverAudioUrl,
          followUp: false, // 기본값: 추가 질문 없음
          // TODO: questionId와 answerText가 필요한지 백엔드 명세 확인 필요
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('답변 제출 실패');
      }

      const result = await submitResponse.json();

      // 답변 ID 저장
      setAnswerId(result.answerId);

      // 응답 상태 확인
      if (result.status === 'PENDING_STT') {
        setRecordingState('pending_stt');
        setSTTStatus('PENDING_STT');

        // STT 대기 중일 때만 SSE 연결 시작
        if (!sseRef.current || sseRef.current.readyState === EventSource.CLOSED) {
          logInfo('STT 대기 중 - SSE 연결 시작');
          connectSSE();
        }

        // STT 타임아웃 설정
        sttTimeoutRef.current = setTimeout(() => {
          logInfo('STT 타임아웃 - 상태 조회 시작');
          if (result.answerId) {
            checkAnswerStatus(result.answerId);
          }
        }, CONFIG.STT_TIMEOUT);

        logInfo('STT 변환 대기 중', result);
      } else {
        // 즉시 완료된 경우
        setRecordingState('completed');
        if (onAnswerComplete) {
          onAnswerComplete(serverAudioUrl);
        }
        logInfo('업로드 및 처리 완료', result);
      }
    } catch (error) {
      logError('업로드 실패', error, { retryCount, fileSize: audioBlob?.size });

      setRecordingState('error');
      setErrorMessage(`업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);

      if (onError) {
        onError(error instanceof Error ? error.message : '업로드 실패');
      }
    }
  };

  // STT 재시도 (백엔드 명세에 따른)
  const retrySTT = async () => {
    if (!answerId) {
      setErrorMessage('답변 ID가 없습니다.');
      return;
    }

    if (retryCount >= CONFIG.MAX_RETRY_COUNT) {
      setErrorMessage('최대 재시도 횟수를 초과했습니다.');
      return;
    }

    try {
      setRetryCount((prev) => prev + 1);
      setErrorMessage('');
      setRecordingState('pending_stt');

      const response = await fetch(`/api/answers/${answerId}/retry-stt`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      });

      if (!response.ok) {
        throw new Error('STT 재시도 요청 실패');
      }

      // 다시 SSE로 변환 결과 대기
      sttTimeoutRef.current = setTimeout(() => {
        logInfo('STT 재시도 타임아웃 - 상태 조회 시작');
        checkAnswerStatus(answerId);
      }, CONFIG.STT_TIMEOUT);

      logInfo('STT 재시도 요청 완료', { answerId, retryCount });
    } catch (error) {
      logError('STT 재시도 실패', error, { answerId, retryCount });
      setRecordingState('error');
      setErrorMessage('재시도에 실패했습니다.');
    }
  };

  // 일반 재시도 로직 (업로드부터 다시)
  const handleRetry = () => {
    if (retryCount < CONFIG.MAX_RETRY_COUNT) {
      setRetryCount((prev) => prev + 1);
      setErrorMessage('');

      if (audioBlob) {
        uploadToServer();
      } else {
        setRecordingState('idle');
      }
    } else {
      setErrorMessage('최대 재시도 횟수를 초과했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
    }
  };

  // 상태별 메시지 및 UI
  const getStatusInfo = () => {
    switch (recordingState) {
      case 'recording':
        return {
          message: `녹음 중... (${Math.floor(recordingTime / 1000)}초)`,
          showProgress: false,
          canRetry: false,
        };
      case 'processing':
        return {
          message: '녹음 처리 중...',
          showProgress: false,
          canRetry: false,
        };
      case 'uploading':
        return {
          message: `업로드 중... (${uploadProgress}%)`,
          showProgress: true,
          canRetry: false,
        };
      case 'pending_stt':
        return {
          message: '텍스트 변환 처리 중...',
          showProgress: false,
          canRetry: false,
        };
      case 'completed':
        return {
          message: '업로드 완료!',
          showProgress: false,
          canRetry: false,
        };
      case 'error':
        return {
          message: errorMessage || '오류가 발생했습니다.',
          showProgress: false,
          canRetry: retryCount < CONFIG.MAX_RETRY_COUNT,
        };
      default:
        return {
          message: '마이크 버튼을 눌러 녹음을 시작하세요.',
          showProgress: false,
          canRetry: false,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const isRecording = recordingState === 'recording';
  const canRecord = recordingState === 'idle' && networkState === 'online';

  return (
    <Wrapper>
      <StatusSection>
        <h2>음성 답변</h2>

        {/* 네트워크 상태 표시 */}
        <NetworkStatus $isOnline={networkState === 'online'}>
          {networkState === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
          {networkState === 'online' ? '온라인' : '오프라인'}
        </NetworkStatus>
      </StatusSection>

      {/* 녹음 버튼 */}
      <RecordButton
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={!canRecord && !isRecording}
        $isRecording={isRecording}
        $isDisabled={!canRecord && !isRecording}
      >
        {isRecording ? <Square size={40} /> : <Mic size={40} />}
      </RecordButton>

      {/* 상태 메시지 */}
      <StatusMessage $hasError={recordingState === 'error'}>
        {recordingState === 'error' && <AlertCircle size={16} />}
        {statusInfo.message}
      </StatusMessage>

      {/* 진행률 바 */}
      {statusInfo.showProgress && (
        <ProgressBar>
          <ProgressFill style={{ width: `${uploadProgress}%` }} />
        </ProgressBar>
      )}

      {/* 오디오 미리보기 */}
      {audioUrl && recordingState !== 'uploading' && (
        <AudioPreview>
          <audio controls src={audioUrl} />
        </AudioPreview>
      )}

      {/* 변환된 텍스트 표시 */}
      {convertedText && (
        <ConvertedText>
          <h4>변환된 텍스트:</h4>
          <p>{convertedText}</p>
        </ConvertedText>
      )}

      {/* 액션 버튼들 */}
      <ActionButtons>
        {recordingState === 'processing' && (
          <ActionButton type="button" onClick={uploadToServer}>
            <Upload size={16} />
            업로드
          </ActionButton>
        )}

        {statusInfo.canRetry && (
          <>
            {sttStatus === 'FAILED_STT' && answerId ? (
              <RetryButton type="button" onClick={retrySTT}>
                STT 재시도 ({retryCount}/{CONFIG.MAX_RETRY_COUNT})
              </RetryButton>
            ) : (
              <RetryButton type="button" onClick={handleRetry}>
                재시도 ({retryCount}/{CONFIG.MAX_RETRY_COUNT})
              </RetryButton>
            )}
          </>
        )}
      </ActionButtons>
    </Wrapper>
  );
};

export default RecordAnswer;

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const NetworkStatus = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${(props) => (props.$isOnline ? '#22c55e' : '#ef4444')};
  background: ${(props) => (props.$isOnline ? '#dcfce7' : '#fee2e2')};
  padding: 4px 8px;
  border-radius: 12px;
`;

const RecordButton = styled.button<{ $isRecording: boolean; $isDisabled: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  background: ${(props) => {
    if (props.$isDisabled) return '#e5e7eb';
    return props.$isRecording ? '#ef4444' : '#3b82f6';
  }};

  color: ${(props) => (props.$isDisabled ? '#9ca3af' : 'white')};

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const StatusMessage = styled.p<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: ${(props) => (props.$hasError ? '#ef4444' : '#374151')};
  font-weight: ${(props) => (props.$hasError ? '600' : '400')};
  margin: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
`;

const AudioPreview = styled.div`
  width: 100%;

  audio {
    width: 100%;
  }
`;

const ConvertedText = styled.div`
  width: 100%;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;

  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: #1f2937;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RetryButton = styled(ActionButton)`
  background: #f59e0b;

  &:hover {
    background: #d97706;
  }
`;
