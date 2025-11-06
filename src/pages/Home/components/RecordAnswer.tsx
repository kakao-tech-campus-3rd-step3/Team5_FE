import { useState, useRef, useEffect, useCallback } from 'react';

import styled from '@emotion/styled';
import { Mic, Square, Upload, AlertCircle, Wifi, WifiOff } from 'lucide-react';

import apiClient, { API_BASE_URL } from '../../../api/apiClient';
import { ACCESS_TOKEN_KEY } from '../../../shared/utils/auth';

interface RecordAnswerProps {
  questionId?: number;
  answerText?: string;
  onAnswerComplete?: (
    audioUrl: string,
    text?: string,
    alreadySubmitted?: boolean,
    feedbackId?: number
  ) => void;
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

const RecordAnswer = ({ questionId, answerText, onAnswerComplete, onError }: RecordAnswerProps) => {
  // 상태 관리
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [networkState, setNetworkState] = useState<NetworkState>('online');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answerId, setAnswerId] = useState<number | null>(null);
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
  const checkAnswerStatus = async (answerIdToCheck: number) => {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const uploadTimeout = uploadTimeoutRef.current;
      if (uploadTimeout) clearTimeout(uploadTimeout);

      const sttTimeout = sttTimeoutRef.current;
      if (sttTimeout) clearTimeout(sttTimeout);

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

  // 로깅 함수들 (useEffect보다 먼저 정의)
  const logError = useCallback(
    (stage: string, error: Error | unknown, context?: Record<string, unknown>) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(`[AudioRecording] ${stage}:`, {
        error: errorMessage,
        stack: errorStack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        retryCount,
      });
    },
    [retryCount]
  );

  const logInfo = useCallback((message: string, data?: Record<string, unknown>) => {
    console.log(`[AudioRecording] ${message}`, data || '');
  }, []);

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
  }, [logError, logInfo]);

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
  const uploadWithProgress = async (
    preSignedUrl: string,
    file: Blob,
    fileName: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      console.log('📤 [파일 업로드 시작]', {
        preSignedUrl: preSignedUrl.substring(0, 100) + '...',
        fileSize: file.size,
        fileType: file.type,
        method: 'PUT',
      });

      // 업로드 진행률
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          console.log(`📊 [업로드 진행률] ${progress}%`);
        }
      };

      xhr.onload = () => {
        console.log('✅ [파일 업로드 완료]', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseHeaders: xhr.getAllResponseHeaders(),
        });

        if (xhr.status >= 200 && xhr.status < 300) {
          logInfo('파일 업로드 성공', { status: xhr.status, fileSize: file.size });
          resolve();
        } else {
          console.error('❌ [파일 업로드 실패]', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
          });
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        console.error('❌ [파일 업로드 네트워크 에러]', {
          status: xhr.status,
          statusText: xhr.statusText,
          readyState: xhr.readyState,
          responseText: xhr.responseText,
          responseHeaders: xhr.getAllResponseHeaders(),
          url: preSignedUrl.substring(0, 100) + '...',
        });

        // CORS 에러인 경우 더 명확한 메시지 제공
        if (xhr.status === 0 && xhr.readyState === 4) {
          console.error('❌ [CORS 에러] Object Storage가 CORS를 허용하지 않습니다.');
          console.error('⚠️ 해결 방법: NCP Object Storage CORS 설정 필요');
          console.error('   - Allowed Origins: http://localhost:5173, https://dailyq.my 등');
          console.error('   - Allowed Methods: PUT, POST, GET, DELETE');
          console.error('   - Allowed Headers: Content-Type 등');
          reject(
            new Error(
              'CORS 에러: Object Storage CORS 설정이 필요합니다. 백엔드/인프라팀에 문의하세요.'
            )
          );
        } else {
          reject(new Error('Upload network error'));
        }
      };

      xhr.ontimeout = () => {
        console.error('❌ [파일 업로드 타임아웃]', { timeout: CONFIG.UPLOAD_TIMEOUT });
        reject(new Error('Upload timeout'));
      };

      xhr.timeout = CONFIG.UPLOAD_TIMEOUT;

      // PUT 요청으로 pre-signed URL에 파일 직접 업로드
      xhr.open('PUT', preSignedUrl);

      // ⚠️ 중요: FormData를 사용하지 않고 파일 Blob을 직접 전송
      // FormData를 사용하면 preflight OPTIONS 요청이 발생하여 CORS 문제 발생
      // 파일만 body에 직접 첨부하여 전송 (fileName은 백엔드가 이미 알고 있음)
      // Content-Type 헤더를 제거하여 브라우저가 자동 감지하도록 함
      // S3/Object Storage는 파일 내용을 보고 Content-Type을 자동 감지함
      // 주의: 일부 브라우저는 PUT 요청에서도 preflight를 보낼 수 있음 (Object Storage CORS 설정 필요)

      console.log('📦 [PUT 요청 정보]', {
        preSignedUrl: preSignedUrl.substring(0, 100) + '...',
        fileName,
        fileSize: file.size,
        fileType: file.type,
        method: 'PUT',
        hasContentTypeHeader: false,
        note: '파일 Blob을 직접 전송, Content-Type 헤더 없음 (브라우저 자동 감지)',
        warning:
          'PUT 요청은 여전히 preflight를 트리거할 수 있습니다. Object Storage CORS 설정이 필요합니다.',
      });

      // 파일 Blob을 직접 body에 전송 (Content-Type 없이)
      // 브라우저가 Blob의 type을 자동으로 사용하거나, 서버가 자동 감지
      xhr.send(file);

      logInfo('파일 업로드 시작', { fileSize: file.size, fileType: file.type });
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
      // ⚠️ 중요: 백엔드가 .webm을 받지 않으므로 반드시 .mp3로 설정
      // 빌드 캐시 문제로 인해 .webm이 나올 수 있으므로 강제로 .mp3로 고정
      const timestamp = Date.now();

      // 확장자를 명시적으로 .mp3로 강제 설정 (절대 .webm이 되지 않도록)
      // 문자열 리터럴을 사용하여 빌드 최적화가 확장자를 변경하지 못하도록 함
      const extension = '.mp3'; // 상수로 정의하여 변경 불가능하게 함
      let fileName = `audio_${timestamp}${extension}`;

      // 최종 검증: 반드시 .mp3로 끝나도록 강제
      if (!fileName.endsWith('.mp3')) {
        console.error('❌ [치명적 오류] 파일명이 .mp3로 끝나지 않습니다! 강제 수정합니다.', {
          원본파일명: fileName,
          파일명길이: fileName.length,
          마지막3글자: fileName.slice(-3),
        });
        // 확장자 제거 후 .mp3 추가
        fileName = fileName.replace(/\.[^.]+$/, '') + '.mp3';
      }

      // 배포 환경 확인을 위한 상세 로그
      console.log('📝 [파일명 생성 및 검증]', {
        최종파일명: fileName,
        확장자: fileName.split('.').pop(),
        타임스탬프: timestamp,
        extension상수: extension,
        API_BASE_URL: API_BASE_URL,
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        프로덕션모드: import.meta.env.PROD,
        개발모드: import.meta.env.DEV,
        빌드시간: new Date().toISOString(),
        파일명검증결과: fileName.endsWith('.mp3') ? '✅ mp3 확인' : '❌ mp3 아님',
        파일명길이: fileName.length,
        파일명시작: fileName.substring(0, 10),
        파일명끝: fileName.substring(fileName.length - 4),
      });

      // 런타임 검증: 혹시 모를 빌드 최적화나 변수 치환을 막기 위한 추가 검증
      if (fileName.includes('.webm')) {
        console.error('❌ [치명적 오류] 파일명에 .webm이 포함되어 있습니다! 즉시 수정합니다.');
        fileName = fileName.replace(/\.webm/g, '.mp3');
      }

      // 최종 파일명 확인 (요청 직전 재검증)
      if (!fileName.endsWith('.mp3')) {
        console.error('❌ [최종 검증 실패] 파일명이 여전히 .mp3가 아닙니다!', fileName);
        fileName = `audio_${Date.now()}.mp3`;
        console.warn('✅ [파일명 강제 수정 완료]', fileName);
      }

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const requestUrl = `${API_BASE_URL}/api/answers/upload-url?fileName=${encodeURIComponent(fileName)}`;

      console.log('📤 [Pre-signed URL 요청]', {
        url: '/api/answers/upload-url',
        apiBaseUrl: API_BASE_URL,
        fullUrl: requestUrl,
        method: 'GET',
        fileName: fileName,
        fileName검증: fileName.endsWith('.mp3') ? '✅ .mp3 확인' : '❌ .mp3 아님',
        encode된파일명: encodeURIComponent(fileName),
        token: token ? `${token.substring(0, 20)}...` : '없음',
        hasToken: !!token,
      });

      // apiClient를 사용하여 프로덕션 백엔드로 요청
      try {
        // 백엔드가 기대하는 형식 확인을 위해 파라미터 상세 로깅
        // 백엔드가 snake_case를 선호할 수 있으므로 두 가지 형식 모두 시도
        const requestParams = {
          fileName, // camelCase
          file_name: fileName, // snake_case (일부 백엔드는 이것을 선호)
        };
        console.log('📋 [Pre-signed URL 파라미터]', {
          fileName: fileName,
          fileNameType: typeof fileName,
          fileNameLength: fileName.length,
          params: requestParams,
          paramsStringified: JSON.stringify(requestParams),
          note: 'fileName과 file_name 둘 다 포함하여 전송 (백엔드가 snake_case를 선호할 수 있음)',
        });

        // 먼저 fileName만으로 시도
        let response;
        try {
          console.log('🔄 [Pre-signed URL 요청 시도 1] fileName 사용:', fileName);
          response = await apiClient.get<{ preSignedUrl: string; finalAudioUrl: string }>(
            '/api/answers/upload-url',
            {
              params: { fileName },
            }
          );
        } catch (firstError: unknown) {
          const error = firstError as {
            response?: { status?: number; statusText?: string; data?: unknown };
            message?: string;
          };
          console.error('❌ [Pre-signed URL 요청 실패 1]', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            fileName,
          });

          // 400 또는 404 에러인 경우 file_name으로 재시도
          if (error.response?.status === 400 || error.response?.status === 404) {
            console.log('⚠️ [재시도] fileName으로 실패, file_name으로 재시도');
            try {
              response = await apiClient.get<{ preSignedUrl: string; finalAudioUrl: string }>(
                '/api/answers/upload-url',
                {
                  params: { file_name: fileName },
                }
              );
              console.log('✅ [재시도 성공] file_name 사용:', fileName);
            } catch (secondError: unknown) {
              const secondErr = secondError as {
                response?: { status?: number; statusText?: string; data?: unknown };
                message?: string;
              };
              console.error('❌ [Pre-signed URL 요청 실패 2] file_name도 실패:', {
                status: secondErr.response?.status,
                statusText: secondErr.response?.statusText,
                data: secondErr.response?.data,
                message: secondErr.message,
              });
              throw secondError;
            }
          } else {
            throw firstError;
          }
        }

        const { preSignedUrl, finalAudioUrl: serverAudioUrl } = response.data;

        console.log('✅ [Pre-signed URL 획득 성공]', {
          preSignedUrl,
          serverAudioUrl,
          preSignedUrlLength: preSignedUrl?.length,
        });

        logInfo('Pre-signed URL 획득 성공', { preSignedUrl, serverAudioUrl });

        // 2. 파일 업로드 (fileName을 함께 전송)
        await uploadWithProgress(preSignedUrl, audioBlob, fileName);

        // 3. 답변 제출
        if (!questionId) {
          throw new Error('질문 ID가 필요합니다.');
        }

        const requestBody = {
          questionId,
          // STT 변환이 완료된 경우 convertedText 사용, 없으면 answerText prop 사용, 둘 다 없으면 빈 문자열
          answerText: convertedText || answerText || '',
          audioUrl: serverAudioUrl,
          followUp: false,
        };

        console.log('📤 [답변 제출 요청]', {
          url: '/api/answers',
          apiBaseUrl: API_BASE_URL,
          method: 'POST',
          fullUrl: `${API_BASE_URL}/api/answers`,
          body: requestBody,
          bodyStringified: JSON.stringify(requestBody, null, 2),
          bodyKeys: Object.keys(requestBody),
          bodyValues: Object.values(requestBody),
          questionId: questionId ?? 'undefined ⚠️',
          answerText: requestBody.answerText,
          answerTextType: typeof requestBody.answerText,
          answerTextLength: requestBody.answerText?.length,
          audioUrl: serverAudioUrl,
          audioUrlType: typeof serverAudioUrl,
          audioUrlLength: serverAudioUrl?.length,
          followUp: requestBody.followUp,
          followUpType: typeof requestBody.followUp,
        });

        console.log('📦 [POST /api/answers 요청 Body 상세]', JSON.stringify(requestBody, null, 2));

        try {
          console.log('📤 [POST /api/answers 최종 요청 Body]', {
            questionId: typeof questionId === 'number' ? questionId : '⚠️ 숫자가 아님',
            answerText:
              typeof requestBody.answerText === 'string'
                ? requestBody.answerText
                : '⚠️ 문자열이 아님',
            audioUrl:
              typeof requestBody.audioUrl === 'string' ? requestBody.audioUrl : '⚠️ 문자열이 아님',
            followUp:
              typeof requestBody.followUp === 'boolean' ? requestBody.followUp : '⚠️ 불린이 아님',
            전체Body: requestBody,
          });

          const submitResponse = await apiClient.post<{
            answerId: number;
            answerText: string;
            feedbackId: number;
            status?: string;
          }>('/api/answers', requestBody);

          const result = submitResponse.data;

          // 백엔드 응답에 변환된 텍스트가 포함되어 있으면 사용
          if (result.answerText && result.answerText !== '음성 답변') {
            setConvertedText(result.answerText);
            console.log('✅ [백엔드 응답에서 변환된 텍스트 발견]', {
              answerText: result.answerText,
            });
          }

          console.log('✅ [POST /api/answers 응답 성공]', {
            answerId: result.answerId,
            feedbackId: result.feedbackId,
            status: result.status,
            answerText: result.answerText,
            전체응답: result,
          });

          console.log('✅ [답변 제출 성공]', {
            answerId: result.answerId,
            feedbackId: result.feedbackId,
            status: result.status,
          });

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

            console.log('✅ [RecordAnswer] 답변 제출 완료', {
              answerId: result.answerId,
              feedbackId: result.feedbackId,
              audioUrl: serverAudioUrl,
              status: result.status,
              note: 'RecordAnswer에서 이미 제출 완료 - 이미 제출됨 플래그 및 feedbackId 전달',
            });

            // ⚠️ 중요: RecordAnswer에서 이미 답변을 제출했으므로
            // onAnswerComplete에 alreadySubmitted=true 플래그와 feedbackId를 전달하여
            // 상위 컴포넌트가 중복 제출하지 않고 피드백 페이지로 이동하도록 함
            if (onAnswerComplete) {
              onAnswerComplete(
                serverAudioUrl,
                undefined,
                true, // alreadySubmitted = true
                result.feedbackId // feedbackId 전달
              );
            }

            logInfo('업로드 및 처리 완료', result);
          }
        } catch (submitError: unknown) {
          const error = submitError as {
            response?: {
              status?: number;
              statusText?: string;
              data?: { message?: string; detail?: string };
            };
            config?: { headers?: unknown; url?: string; baseURL?: string };
            message?: string;
          };
          // 답변 제출 에러 상세 로깅
          if (error.response) {
            console.error('❌ [답변 제출 실패]', {
              status: error.response.status,
              statusText: error.response.statusText,
              responseData: error.response.data,
              requestBody: requestBody,
              requestHeaders: error.config?.headers,
              url: error.config?.url,
              baseURL: error.config?.baseURL,
            });

            const errorMessage =
              error.response.data?.message ||
              error.response.data?.detail ||
              JSON.stringify(error.response.data);
            throw new Error(`답변 제출 실패 (${error.response.status}): ${errorMessage}`);
          } else {
            console.error('❌ [답변 제출 네트워크 에러]', {
              message: error.message,
              requestBody: requestBody,
            });
            throw submitError;
          }
        }
      } catch (error: unknown) {
        // 에러 응답 본문 확인
        const err = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
          config?: {
            url?: string;
            method?: string;
            headers?: unknown;
            params?: unknown;
            baseURL?: string;
          };
          message?: string;
          code?: string;
          stack?: string;
        };
        if (err.response) {
          const errorData = err.response.data;
          console.error('❌ [Pre-signed URL 요청 실패]', {
            status: err.response.status,
            statusText: err.response.statusText,
            responseData: errorData,
            responseDataStringified: JSON.stringify(errorData, null, 2),
            requestParams: {
              fileName: fileName,
              fullUrl: `${API_BASE_URL}/api/answers/upload-url?fileName=${encodeURIComponent(fileName)}`,
            },
            config: {
              url: err.config?.url,
              method: err.config?.method,
              headers: err.config?.headers,
              params: err.config?.params,
              paramsStringified: JSON.stringify(err.config?.params, null, 2),
              baseURL: err.config?.baseURL,
            },
          });

          // 에러 메시지 추출 (더 상세하게)
          let errorMessage = 'Pre-signed URL 획득 실패';
          if (errorData) {
            if (typeof errorData === 'string') {
              errorMessage = errorData;
            } else {
              const data = errorData as {
                detail?: string;
                message?: string;
                title?: string;
                code?: string;
                instance?: string;
                type?: string;
                status?: number;
              };
              if (data.detail) {
                errorMessage = data.detail;
              } else if (data.message) {
                errorMessage = data.message;
              } else if (data.title) {
                errorMessage = `${data.title}: ${data.detail || ''}`;
              } else {
                errorMessage = JSON.stringify(errorData);
              }
            }
          }

          const errorDataTyped = errorData as {
            code?: string;
            detail?: string;
            message?: string;
            instance?: string;
            type?: string;
            status?: number;
          };
          console.error('❌ [Pre-signed URL 에러 상세]', {
            code: errorDataTyped?.code,
            detail: errorDataTyped?.detail,
            message: errorDataTyped?.message,
            instance: errorDataTyped?.instance,
            type: errorDataTyped?.type,
            status: errorDataTyped?.status,
          });

          throw new Error(`Pre-signed URL 획득 실패 (${err.response.status}): ${errorMessage}`);
        } else {
          console.error('❌ [Pre-signed URL 요청 실패 - 네트워크 에러]', {
            message: err.message,
            code: err.code,
            stack: err.stack,
            fileName: fileName,
          });
          throw error;
        }
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
