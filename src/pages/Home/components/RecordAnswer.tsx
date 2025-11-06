import { useState, useRef, useEffect, useCallback } from 'react';

import styled from '@emotion/styled';
import { Mic, Square, Upload, AlertCircle, Wifi, WifiOff } from 'lucide-react';

import { getSSEToken } from '../../../api/answers';
import apiClient, { API_BASE_URL } from '../../../api/apiClient';
import { ACCESS_TOKEN_KEY, isTokenExpired } from '../../../shared/utils/auth';

// Web Audio API를 사용하여 webm을 OGG로 변환하는 함수
// OGG는 브라우저에서 직접 인코딩 가능하고 라이선스 문제가 없습니다.
const convertWebmToOgg = async (webmBlob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // AudioBuffer를 OGG로 변환
          // MediaRecorder를 사용하여 OGG 형식으로 인코딩
          const oggBlob = await audioBufferToOgg(audioBuffer);

          console.log('✅ [오디오 변환] OGG 변환 완료:', {
            원본크기: webmBlob.size,
            변환크기: oggBlob.size,
            원본타입: webmBlob.type,
            변환타입: oggBlob.type,
          });

          resolve(oggBlob);
        } catch (error) {
          reject(error);
        }
      };

      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(webmBlob);
    } catch (error) {
      reject(error);
    }
  });
};

// AudioBuffer를 OGG Blob으로 변환
// MediaRecorder를 사용하여 OGG 형식으로 인코딩
const audioBufferToOgg = async (buffer: AudioBuffer): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // AudioContext를 사용하여 MediaStream 생성
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();

      // MediaStreamDestination 생성 (실시간 오디오 스트림)
      const destination = audioContext.createMediaStreamDestination();

      // AudioBufferSourceNode 생성
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(destination);

      // MediaRecorder로 OGG 형식 인코딩
      const mimeType = 'audio/ogg; codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn('⚠️ [OGG 변환] OGG 형식이 지원되지 않습니다. WAV로 변환합니다.');
        const wavBlob = audioBufferToWav(buffer);
        resolve(wavBlob);
        return;
      }

      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: mimeType,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const oggBlob = new Blob(chunks, { type: mimeType });
        audioContext.close();
        resolve(oggBlob);
      };

      mediaRecorder.onerror = () => {
        audioContext.close();
        reject(new Error('MediaRecorder 오류'));
      };

      // 녹음 시작
      mediaRecorder.start();

      // 오디오 재생 시작
      source.start(0);

      // 오디오 재생 완료 후 녹음 중지
      source.onended = () => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        audioContext.close();
      };
    } catch (error) {
      // OGG 변환 실패 시 WAV로 폴백
      console.warn('⚠️ [OGG 변환 실패] WAV로 변환합니다:', error);
      const wavBlob = audioBufferToWav(buffer);
      resolve(wavBlob);
    }
  });
};

// AudioBuffer를 WAV Blob으로 변환
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];

  // WAV 헤더 작성
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  let offset = 0;
  writeString(offset, 'RIFF');
  offset += 4;
  view.setUint32(offset, 36 + length * numberOfChannels * 2, true);
  offset += 4;
  writeString(offset, 'WAVE');
  offset += 4;
  writeString(offset, 'fmt ');
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, numberOfChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * numberOfChannels * 2, true);
  offset += 4;
  view.setUint16(offset, numberOfChannels * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString(offset, 'data');
  offset += 4;
  view.setUint32(offset, length * numberOfChannels * 2, true);
  offset += 4;

  // 채널 데이터 가져오기
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  // 데이터 작성
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

// SSE URL 생성 함수
// 백엔드: GET /api/sse/connect?token={sseToken}
// Media type: text/event-stream
// 초기 응답: { "timeout": 9007199254740991 }
// 쿼리 파라미터로 sseToken 전달 (일회성 토큰)
const getSSEUrl = (sseToken: string): string => {
  const baseUrl = API_BASE_URL || window.location.origin;
  const ssePath = `/api/sse/connect?token=${encodeURIComponent(sseToken)}`;
  const fullUrl = baseUrl + ssePath;

  console.log('🔗 [SSE URL 생성]:', {
    baseUrl,
    ssePath,
    fullUrl,
    sseTokenPreview: sseToken.substring(0, 20) + '...',
    note: '쿼리 파라미터로 sseToken 전달 (일회성 토큰)',
  });

  return fullUrl;
};

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
  onAudioUrlChange?: (url: string) => void; // audioUrl이 변경될 때 호출
  followUp?: boolean; // 질문 응답의 followUp 값
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

const RecordAnswer = ({
  questionId,
  answerText,
  onAnswerComplete,
  onError,
  onAudioUrlChange,
  followUp,
}: RecordAnswerProps) => {
  // 상태 관리
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [networkState, setNetworkState] = useState<NetworkState>('online');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answerId, setAnswerId] = useState<number | null>(null);
  const [feedbackId, setFeedbackId] = useState<number | null>(null); // POST 응답에서 받은 feedbackId 저장
  const [convertedText, setConvertedText] = useState<string>('');
  const [sttStatus, setSTTStatus] = useState<STTStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false); // 업로드 중복 호출 방지

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const uploadTimeoutRef = useRef<number | null>(null);
  const sttTimeoutRef = useRef<number | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingSSERef = useRef(false); // SSE 연결 중복 방지
  const sseTokenRequestRef = useRef(false); // SSE 토큰 요청 중복 방지
  const sseConnectTimeRef = useRef<number | null>(null); // SSE connect 이벤트 수신 시간 저장

  // 오디오 데이터
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // blob URL (미리보기용)
  const [serverAudioUrl, setServerAudioUrl] = useState<string | null>(null); // 서버에 업로드된 실제 URL

  // SSE 연결 설정
  const connectSSE = useCallback(async () => {
    // ⚠️ 중복 호출 방지: 이미 연결 중이거나 연결되어 있으면 무시
    if (isConnectingSSERef.current) {
      console.warn('⚠️ [SSE] 이미 연결 중입니다. 중복 호출을 무시합니다.');
      return;
    }

    if (sseRef.current && sseRef.current.readyState !== EventSource.CLOSED) {
      console.warn('⚠️ [SSE] 이미 연결되어 있습니다. 중복 호출을 무시합니다.', {
        readyState: sseRef.current.readyState,
      });
      return;
    }

    try {
      isConnectingSSERef.current = true; // 연결 시작 플래그 설정

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 토큰 만료 체크
      const tokenExpired = isTokenExpired(token);
      console.log('🔍 [SSE] 토큰 상태 확인:', {
        tokenPreview: token.substring(0, 20) + '...',
        isExpired: tokenExpired,
        note: tokenExpired
          ? '⚠️ 토큰이 만료되었습니다. 토큰 갱신이 필요합니다.'
          : '✅ 토큰이 유효합니다.',
      });

      if (tokenExpired) {
        console.warn('⚠️ [SSE] 토큰이 만료되어 SSE 연결을 시도하지 않습니다.');
        setErrorMessage('인증 토큰이 만료되었습니다. 페이지를 새로고침해주세요.');
        isConnectingSSERef.current = false; // 연결 실패 시 플래그 해제
        return;
      }

      // 1단계: GET /api/sse/token으로 일회성 sseToken 받기
      // ⚠️ 중복 요청 방지: 이미 토큰 요청 중이면 무시
      if (sseTokenRequestRef.current) {
        console.warn('⚠️ [SSE] SSE 토큰 요청이 이미 진행 중입니다. 중복 요청을 무시합니다.');
        isConnectingSSERef.current = false;
        return;
      }

      console.log('🔑 [SSE] 일회성 SSE 토큰 요청 시작:', {
        apiEndpoint: '/api/sse/token',
        note: '헤더에 Authorization 토큰이 자동으로 포함됩니다.',
      });

      let sseToken: string;
      try {
        sseTokenRequestRef.current = true; // 토큰 요청 시작 플래그 설정
        const sseTokenResponse = await getSSEToken();
        sseToken = sseTokenResponse.sseToken;
        sseTokenRequestRef.current = false; // 토큰 요청 완료 플래그 해제

        console.log('✅ [SSE] 일회성 SSE 토큰 수신 성공:', {
          sseTokenPreview: sseToken.substring(0, 20) + '...',
          sseTokenLength: sseToken.length,
          note: '이제 이 sseToken을 사용하여 SSE 연결을 시도합니다.',
        });
        logInfo('SSE 토큰 수신 성공', { sseTokenPreview: sseToken.substring(0, 20) + '...' });
      } catch (error) {
        sseTokenRequestRef.current = false; // 토큰 요청 실패 시 플래그 해제
        isConnectingSSERef.current = false; // 연결 실패 시 플래그 해제
        logError('SSE 토큰 요청 실패', error, {});
        setErrorMessage('SSE 토큰을 받아오는데 실패했습니다. 다시 시도해주세요.');
        return;
      }

      // 2단계: 받은 sseToken으로 SSE 연결
      const sseUrl = getSSEUrl(sseToken);

      console.log('🔗 [SSE] 연결 시도:', {
        url: sseUrl,
        baseURL: API_BASE_URL,
        fullUrl: sseUrl,
        sseTokenPreview: sseToken.substring(0, 20) + '...',
        note: '쿼리 파라미터로 sseToken 전달 (일회성 토큰)',
      });

      logInfo('SSE 연결 시도 시작', { url: sseUrl, baseURL: API_BASE_URL });

      // ✅ 백엔드 요구사항: EventSource 사용 (쿼리 파라미터로 sseToken 전달)
      console.log('🔧 [SSE] EventSource 사용 (백엔드 요구사항):', {
        url: sseUrl,
        note: 'EventSource는 헤더를 설정할 수 없지만, 쿼리 파라미터로 sseToken 전달',
      });

      // EventSource 생성 (백엔드 예시 코드와 동일)
      const eventSource = new EventSource(sseUrl);
      sseRef.current = eventSource;

      console.log('📡 [SSE] EventSource 생성 완료 - 백엔드에 SSE 연결 요청:', {
        url: eventSource.url,
        readyState: eventSource.readyState,
        readyStateMeaning: {
          0: 'CONNECTING - 연결 시도 중',
          1: 'OPEN - 연결 성공',
          2: 'CLOSED - 연결 종료',
        }[eventSource.readyState],
        withCredentials: eventSource.withCredentials,
        note: 'EventSource가 생성되었습니다. 백엔드는 쿼리 파라미터로 토큰을 받고, "connect" 이벤트를 보내면 연결이 완료됩니다.',
        대기중인이벤트: [
          'connect',
          'message',
          'sttCompleted',
          'sttFailed',
          'stt-completed',
          'stt_completed',
        ],
      });

      // 모든 이벤트를 로깅하기 위한 범용 리스너 (디버깅용)
      const logAllEvents = (eventName: string) => {
        eventSource.addEventListener(eventName, (event) => {
          const eventTimestamp = Date.now();
          const timeSinceConnect = sseConnectTimeRef.current
            ? eventTimestamp - sseConnectTimeRef.current
            : null;
          const hasConnectEvent = sseConnectTimeRef.current !== null;
          console.log(`🔍 [SSE] ✅ connect 이후 백엔드 이벤트 수신 - ${eventName}:`, {
            eventType: eventName,
            rawData: event.data,
            dataType: typeof event.data,
            timestamp: new Date().toISOString(),
            eventTime: eventTimestamp,
            connectTime: sseConnectTimeRef.current,
            hasConnectEvent: hasConnectEvent,
            timeSinceConnect: timeSinceConnect
              ? `${timeSinceConnect}ms (${(timeSinceConnect / 1000).toFixed(2)}초)`
              : '알 수 없음 (connect 이벤트가 아직 수신되지 않음)',
            note:
              hasConnectEvent && timeSinceConnect !== null
                ? `✅ connect 이벤트 이후 ${(timeSinceConnect / 1000).toFixed(2)}초 후 백엔드에서 ${eventName} 이벤트를 보냈습니다.`
                : '⚠️ connect 이벤트가 아직 수신되지 않았습니다. (이벤트 순서 확인 필요)',
          });
        });
      };

      // 가능한 모든 이벤트 이름 리스닝 (디버깅용)
      ['stt-completed', 'stt_completed', 'sttComplete', 'text', 'transcript'].forEach(logAllEvents);

      // 주기적으로 SSE 연결 상태 확인 (디버깅용) - 로그 제거
      const statusCheckInterval = setInterval(() => {
        // 로그 제거 - 상태 확인만 수행
        if (sseRef.current && sseConnectTimeRef.current) {
          // 상태 확인만 수행 (로그 없음)
        }
      }, 5000); // 5초마다 상태 확인

      eventSource.onopen = () => {
        console.log('✅ [SSE] EventSource.onopen 호출 - 백엔드와 SSE 연결 성공!', {
          url: eventSource.url,
          readyState: eventSource.readyState,
          readyStateMeaning: 'OPEN (연결됨)',
          timestamp: new Date().toISOString(),
          note: '백엔드와 SSE 연결이 성공적으로 열렸습니다. 이제 connect 이벤트를 기다립니다.',
        });
        logInfo('SSE 연결 성공');
        reconnectAttemptsRef.current = 0;
        isConnectingSSERef.current = false; // 연결 성공 시 플래그 해제
      };

      // ✅ 백엔드가 보내는 "connect" 이벤트 리스닝 (연결 성공 확인용)
      eventSource.addEventListener('connect', (event) => {
        try {
          // 백엔드가 JSON이 아닌 단순 문자열("connected")을 보낼 수 있음
          let data: string | Record<string, unknown>;
          const rawData = event.data;

          if (rawData && typeof rawData === 'string') {
            // JSON 형식인지 확인
            if (rawData.trim().startsWith('{') || rawData.trim().startsWith('[')) {
              // JSON 형식인 경우
              data = JSON.parse(rawData);
            } else {
              // 단순 문자열인 경우 (예: "connected")
              data = rawData;
            }
          } else {
            data = rawData;
          }

          const connectTimestamp = Date.now();
          sseConnectTimeRef.current = connectTimestamp; // connect 이벤트 시간 저장
          console.log('✅ [SSE] 백엔드 connect 이벤트 수신 - 연결 성공 확인:', {
            eventType: 'connect',
            rawData: rawData,
            parsedData: data,
            dataType: typeof data,
            timestamp: new Date().toISOString(),
            connectTime: connectTimestamp,
            note: '백엔드에서 SSE 연결 성공을 확인했습니다. 이후 이벤트 수신 시간을 추적합니다.',
          });
          console.log('⏳ [SSE] 백엔드 이벤트 대기 중:', {
            대기중인이벤트: ['sttCompleted', 'sttFailed', 'message'],
            note: '네이버 STT 변환이 완료되면 백엔드가 sttCompleted 또는 sttFailed 이벤트를 보낼 예정입니다. 이벤트가 오지 않으면 백엔드에서 이벤트를 보내지 않았거나 네이버 STT 변환이 아직 완료되지 않았을 수 있습니다.',
            현재시간: new Date().toISOString(),
            connect이후경과시간: '0초',
          });
          logInfo('SSE connect 이벤트 수신', { rawData, parsedData: data });
        } catch {
          // 파싱 실패해도 연결 성공으로 간주 (백엔드가 단순 문자열을 보낸 경우)
          console.log('✅ [SSE] 백엔드 connect 이벤트 수신 (단순 문자열):', {
            eventType: 'connect',
            rawData: event.data,
            note: '백엔드가 단순 문자열을 보냈지만 연결 성공으로 간주합니다.',
          });
          logInfo('SSE connect 이벤트 수신 (단순 문자열)', { rawData: event.data });
        }
      });

      // 초기 연결 메시지 처리 (timeout 정보 등)
      // message 이벤트는 기본 이벤트이므로 STT 텍스트도 여기로 올 수 있음
      eventSource.addEventListener('message', (event) => {
        try {
          const messageTimestamp = Date.now();
          const timeSinceConnect = sseConnectTimeRef.current
            ? messageTimestamp - sseConnectTimeRef.current
            : null;
          const hasConnectEvent = sseConnectTimeRef.current !== null;
          console.log('📨 [SSE] ✅ connect 이후 백엔드 이벤트 수신 - message:', {
            eventType: 'message',
            rawData: event.data,
            dataType: typeof event.data,
            timestamp: new Date().toISOString(),
            messageTime: messageTimestamp,
            connectTime: sseConnectTimeRef.current,
            hasConnectEvent: hasConnectEvent,
            timeSinceConnect: timeSinceConnect
              ? `${timeSinceConnect}ms (${(timeSinceConnect / 1000).toFixed(2)}초)`
              : '알 수 없음 (connect 이벤트가 아직 수신되지 않음)',
            note:
              hasConnectEvent && timeSinceConnect !== null
                ? `✅ connect 이벤트 이후 ${(timeSinceConnect / 1000).toFixed(2)}초 후 백엔드에서 message 이벤트를 보냈습니다.`
                : '⚠️ connect 이벤트가 아직 수신되지 않았습니다. (이벤트 순서 확인 필요)',
          });

          let data: Record<string, unknown> | string;
          try {
            data = JSON.parse(event.data) as Record<string, unknown>;
            console.log('✅ [SSE] message JSON 파싱 성공:', data);
          } catch (parseError) {
            console.warn('⚠️ [SSE] message JSON 파싱 실패:', parseError, { rawData: event.data });
            // JSON 파싱 실패 시 원본 데이터를 그대로 사용
            data = event.data;
          }

          // 타입 가드: data가 객체인지 확인
          if (typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>;

            // 백엔드가 보내는 초기 timeout 정보 처리
            if (dataObj.timeout !== undefined) {
              console.log('⏱️ [SSE] 타임아웃 설정:', {
                timeout: dataObj.timeout,
                timeoutInSeconds:
                  typeof dataObj.timeout === 'number' ? dataObj.timeout / 1000 : undefined,
                note: '백엔드에서 설정한 SSE 연결 타임아웃',
              });
              logInfo('SSE 타임아웃 설정', dataObj);
            }

            // STT 텍스트가 message 이벤트로 올 수도 있음
            const text =
              (typeof dataObj.text === 'string' ? dataObj.text : '') ||
              (typeof dataObj.transcript === 'string' ? dataObj.transcript : '') ||
              (typeof dataObj.result === 'string' ? dataObj.result : '') ||
              (typeof dataObj.content === 'string' ? dataObj.content : '') ||
              (typeof dataObj.message === 'string' ? dataObj.message : '') ||
              '';
            if (text && text.trim() !== '' && text !== 'connected') {
              console.log('✅ [SSE] message 이벤트에서 STT 텍스트 발견:', {
                text: text,
                전체데이터: dataObj,
                note: 'message 이벤트로 STT 텍스트가 전달되었습니다.',
              });

              setConvertedText(text);
              setSTTStatus('COMPLETED');
              setRecordingState('completed');

              if (sttTimeoutRef.current) {
                clearTimeout(sttTimeoutRef.current);
              }

              // ✅ STT 완료 후 SSE 연결 닫기
              console.log('🔌 [SSE] STT 완료 (message 이벤트) - SSE 연결 종료');
              if (sseRef.current) {
                sseRef.current.close();
                sseRef.current = null;
              }
              sseTokenRequestRef.current = false; // 연결 종료 시 플래그 해제
              isConnectingSSERef.current = false; // 연결 종료 시 플래그 해제

              // ✅ 변환된 텍스트를 onAnswerComplete에 전달
              // ⚠️ 중요: 서버에 업로드된 실제 URL을 사용 (blob URL이 아님)
              const finalServerAudioUrl =
                serverAudioUrl ||
                (typeof dataObj.audioUrl === 'string' ? dataObj.audioUrl : '') ||
                (typeof dataObj.audio_url === 'string' ? dataObj.audio_url : '') ||
                (typeof dataObj.url === 'string' ? dataObj.url : '') ||
                '';
              // ⚠️ 중요: SSE message 이벤트는 이미 제출된 답변의 STT 완료를 알리는 것이므로
              // onAnswerComplete에 alreadySubmitted=true 플래그를 전달하여
              // 상위 컴포넌트가 중복 제출하지 않도록 함
              if (onAnswerComplete) {
                console.log('📤 [SSE] onAnswerComplete 호출 (message 이벤트):', {
                  audioUrl: finalServerAudioUrl,
                  audioUrlType: finalServerAudioUrl.startsWith('blob:')
                    ? 'blob URL (⚠️ 문제)'
                    : '서버 URL (✅ 정상)',
                  text: text,
                  alreadySubmitted: true,
                  note: '이미 제출된 답변의 STT 완료 알림 - 서버 URL 사용',
                });
                onAnswerComplete(
                  finalServerAudioUrl,
                  text,
                  true, // alreadySubmitted = true (이미 제출된 상태)
                  feedbackId || answerId || undefined // 저장된 feedbackId 우선 사용
                );
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ [SSE] message 이벤트 처리 실패:', error, { rawData: event.data });
        }
      });

      // STT 완료 이벤트
      // 백엔드 스펙: SttCompletedEvent(answerId, userId, answerText)
      // 네이버가 STT 변환을 완료하고 백엔드에 알림 → 백엔드가 SSE로 프론트엔드에 전달
      eventSource.addEventListener('sttCompleted', (event) => {
        try {
          const sttCompletedTimestamp = Date.now();
          const timeSinceConnect = sseConnectTimeRef.current
            ? sttCompletedTimestamp - sseConnectTimeRef.current
            : null;
          const hasConnectEvent = sseConnectTimeRef.current !== null;

          console.log('📨 [SSE] ✅ 네이버 STT 변환 완료 - 백엔드가 SSE로 알림:', {
            eventType: 'sttCompleted',
            rawData: event.data,
            dataType: typeof event.data,
            timestamp: new Date().toISOString(),
            sttCompletedTime: sttCompletedTimestamp,
            connectTime: sseConnectTimeRef.current,
            hasConnectEvent: hasConnectEvent,
            timeSinceConnect: timeSinceConnect
              ? `${timeSinceConnect}ms (${(timeSinceConnect / 1000).toFixed(2)}초)`
              : '알 수 없음 (connect 이벤트가 아직 수신되지 않음)',
            흐름: [
              '1. 네이버가 STT 변환 완료',
              '2. 네이버가 백엔드에 변환 완료 알림',
              '3. 백엔드가 SSE로 프론트엔드에 sttCompleted 이벤트 전송',
              '4. 프론트엔드가 변환된 텍스트를 받음',
            ],
            note:
              hasConnectEvent && timeSinceConnect !== null
                ? `✅ connect 이벤트 이후 ${(timeSinceConnect / 1000).toFixed(2)}초 후 네이버 STT 변환이 완료되어 백엔드가 SSE로 알림을 보냈습니다.`
                : '⚠️ connect 이벤트가 아직 수신되지 않았습니다. (이벤트 순서 확인 필요)',
          });

          // 백엔드 스펙: SttCompletedEvent(answerId, userId, answerText)
          // event.data는 백엔드가 보낸 JSON 문자열
          const sttResult = JSON.parse(event.data) as {
            answerId: number;
            userId: number;
            answerText: string;
          };

          console.log('✅ [SSE] STT 성공 (백엔드 스펙: SttCompletedEvent):', {
            answerId: sttResult.answerId,
            userId: sttResult.userId,
            answerText: sttResult.answerText,
            전체데이터: sttResult,
            note: '백엔드에서 STT 변환이 완료되어 변환된 텍스트를 받았습니다.',
          });

          if (!sttResult.answerText || sttResult.answerText.trim() === '') {
            console.warn('⚠️ [SSE] STT 완료 이벤트에서 answerText가 비어있습니다:', {
              sttResult,
            });
          }

          // answerId 저장 (이미 제출된 답변의 ID)
          if (sttResult.answerId) {
            setAnswerId(sttResult.answerId);
            // answerId와 feedbackId는 동일한 값으로 사용됨
            if (!feedbackId) {
              setFeedbackId(sttResult.answerId);
            }
          }

          setConvertedText(sttResult.answerText);
        setSTTStatus('COMPLETED');
        setRecordingState('completed');

        if (sttTimeoutRef.current) {
          clearTimeout(sttTimeoutRef.current);
        }

          // ✅ STT 완료 후 SSE 연결 닫기 (더 이상 필요 없음)
          console.log('🔌 [SSE] STT 완료 - SSE 연결 종료');
          eventSource.close();
          sseRef.current = null;
          sseTokenRequestRef.current = false; // 연결 종료 시 플래그 해제
          isConnectingSSERef.current = false; // 연결 종료 시 플래그 해제

          // 상태 확인 인터벌 정리
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
          }

          // ⚠️ 중요: SSE sttCompleted 이벤트는 이미 제출된 답변의 STT 완료를 알리는 것이므로
          // onAnswerComplete에 alreadySubmitted=true 플래그를 전달하여
          // 상위 컴포넌트가 중복 제출하지 않도록 함
          // ✅ 변환된 텍스트를 onAnswerComplete에 전달
        if (onAnswerComplete) {
            // ⚠️ 중요: 서버에 업로드된 실제 URL을 사용 (blob URL이 아님)
            const finalServerAudioUrl = serverAudioUrl || '';
            console.log('📤 [SSE] onAnswerComplete 호출 (sttCompleted):', {
              audioUrl: finalServerAudioUrl,
              audioUrlType: finalServerAudioUrl.startsWith('blob:')
                ? 'blob URL (⚠️ 문제)'
                : '서버 URL (✅ 정상)',
              text: sttResult.answerText,
              answerId: sttResult.answerId,
              alreadySubmitted: true,
              feedbackId: feedbackId || sttResult.answerId,
              note: '이미 제출된 답변의 STT 완료 알림 - 서버 URL 사용',
            });
            onAnswerComplete(
              finalServerAudioUrl,
              sttResult.answerText,
              true, // alreadySubmitted = true (이미 제출된 상태)
              feedbackId || sttResult.answerId || undefined // 저장된 feedbackId 우선 사용
            );
          } else {
            console.warn('⚠️ [SSE] onAnswerComplete가 정의되지 않았습니다.');
          }
        } catch (error) {
          console.error('❌ [SSE] sttCompleted 이벤트 처리 중 오류:', error, {
            event: event,
            rawData: event.data,
          });
          logError('STT 완료 이벤트 처리 실패', error, { event });
        }
      });

      // STT 실패 이벤트
      // 백엔드 스펙: SttFailedEvent(answerId, userId, errorMessage)
      eventSource.addEventListener('sttFailed', (event) => {
        const sttFailedTimestamp = Date.now();
        const timeSinceConnect = sseConnectTimeRef.current
          ? sttFailedTimestamp - sseConnectTimeRef.current
          : null;
        const hasConnectEvent = sseConnectTimeRef.current !== null;

        console.log('❌ [SSE] ✅ connect 이후 백엔드 이벤트 수신 - sttFailed:', {
          eventType: 'sttFailed',
          rawData: event.data,
          timestamp: new Date().toISOString(),
          sttFailedTime: sttFailedTimestamp,
          connectTime: sseConnectTimeRef.current,
          hasConnectEvent: hasConnectEvent,
          timeSinceConnect: timeSinceConnect
            ? `${timeSinceConnect}ms (${(timeSinceConnect / 1000).toFixed(2)}초)`
            : '알 수 없음 (connect 이벤트가 아직 수신되지 않음)',
          note:
            hasConnectEvent && timeSinceConnect !== null
              ? `✅ connect 이벤트 이후 ${(timeSinceConnect / 1000).toFixed(2)}초 후 백엔드에서 sttFailed 이벤트를 보냈습니다.`
              : '⚠️ connect 이벤트가 아직 수신되지 않았습니다. (이벤트 순서 확인 필요)',
        });

        // 백엔드 스펙: SttFailedEvent(answerId, userId, errorMessage)
        // event.data는 백엔드가 보낸 JSON 문자열
        const sttError = JSON.parse(event.data) as {
          answerId: number;
          userId: number;
          errorMessage: string;
        };

        console.error('❌ [SSE] STT 실패 (백엔드 스펙: SttFailedEvent):', {
          answerId: sttError.answerId,
          userId: sttError.userId,
          errorMessage: sttError.errorMessage,
          전체데이터: sttError,
        });

        logError('STT 변환 실패', new Error(sttError.errorMessage), sttError);

        setSTTStatus('FAILED_STT');
        setRecordingState('error');
        setErrorMessage('음성을 텍스트로 변환하는데 실패했습니다.');

        if (sttTimeoutRef.current) {
          clearTimeout(sttTimeoutRef.current);
        }

        // ✅ STT 실패 후 SSE 연결 닫기 (더 이상 필요 없음)
        console.log('🔌 [SSE] STT 실패 - SSE 연결 종료');
        eventSource.close();
        sseRef.current = null;
        sseTokenRequestRef.current = false; // 연결 종료 시 플래그 해제
        isConnectingSSERef.current = false; // 연결 종료 시 플래그 해제

        // 상태 확인 인터벌 정리
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
        }
      });

      // SSE 에러 처리
      eventSource.onerror = (event) => {
        // 상태 확인 인터벌 정리
        clearInterval(statusCheckInterval);

        const readyState = eventSource.readyState;
        const errorMsg =
          readyState === EventSource.CLOSED
            ? 'SSE 연결이 종료되었습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
            : 'SSE 연결 오류가 발생했습니다.';

        // 🔍 오류 발생 지점 상세 분석
        console.error('❌ [SSE] 연결 오류 발생 - 상세 분석:', {
          readyState,
          readyStateMeaning: {
            0: 'CONNECTING - 연결 시도 중',
            1: 'OPEN - 연결 성공',
            2: 'CLOSED - 연결 종료',
          }[readyState],
          url: eventSource.url,
          originalUrl: sseUrl,
          event: event,
          timestamp: new Date().toISOString(),
        });

        // 🔍 오류 원인 분석
        if (readyState === EventSource.CLOSED) {
          console.error('🔍 [SSE] 오류 원인 분석:', {
            문제: '연결이 즉시 종료됨 (readyState: 2 = CLOSED)',
            가능한원인: [
              '1. 백엔드가 요청을 /login으로 리다이렉트 (인증 실패)',
              '2. 백엔드가 쿼리 파라미터 token을 인식하지 못함',
              '3. CORS 설정 문제로 브라우저가 요청을 차단',
              '4. 백엔드 서버가 SSE 엔드포인트를 처리하지 못함',
            ],
            확인사항: {
              토큰유효성: !tokenExpired ? '✅ 유효' : '❌ 만료',
              sseToken포함여부: sseUrl.includes('token=') ? '✅ 포함됨' : '❌ 없음',
              URL형식: sseUrl.startsWith('https://') ? '✅ HTTPS' : '❌ HTTP',
            },
          });

          // URL이 /login으로 리다이렉트되었는지 확인
          if (eventSource.url.includes('/login')) {
            console.error('❌ [SSE] 백엔드가 /login으로 리다이렉트했습니다:', {
              원인: '백엔드 인증 필터가 SSE 요청을 인증 실패로 판단',
              가능한이유: [
                '1. 백엔드가 쿼리 파라미터 sseToken을 읽지 못함',
                '2. 백엔드 인증 필터가 SSE 엔드포인트를 제외하지 않음',
                '3. sseToken 파싱 오류',
              ],
              해결방법:
                '백엔드에서 SSE 엔드포인트의 쿼리 파라미터 sseToken을 올바르게 처리하는지 확인 필요',
            });
            setErrorMessage(
              '인증이 실패했습니다. 백엔드가 쿼리 파라미터 토큰을 인식하지 못하는 것 같습니다.'
            );
          } else {
            console.error('❌ [SSE] 다른 원인으로 연결 실패:', {
              최종URL: eventSource.url,
              원래URL: sseUrl,
              차이점: eventSource.url !== sseUrl ? 'URL이 변경됨 (리다이렉트 가능성)' : 'URL 동일',
            });
          }
        } else {
          console.error('❌ [SSE] 연결 중 오류 발생:', {
            readyState,
            note: '연결은 시도되었지만 중간에 오류 발생',
          });
        }

        logError('SSE 연결 오류', new Error(errorMsg), {
          event,
          readyState: eventSource.readyState,
          url: eventSource.url,
        });
        eventSource.close();
        sseTokenRequestRef.current = false; // 연결 종료 시 플래그 해제
        isConnectingSSERef.current = false; // 연결 종료 시 플래그 해제

        // 재연결 시도 (최대 2회로 제한하여 서버가 없을 때 무한 재시도 방지)
        const maxSSERetryCount = 2;
        if (reconnectAttemptsRef.current < maxSSERetryCount) {
          reconnectAttemptsRef.current++;
          setTimeout(() => {
            logInfo(`SSE 재연결 시도 ${reconnectAttemptsRef.current}/${maxSSERetryCount}`);
            connectSSE();
          }, 2000 * reconnectAttemptsRef.current);
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
      sseTokenRequestRef.current = false; // 에러 발생 시 플래그 해제
      isConnectingSSERef.current = false; // 연결 실패 시 플래그 해제
      logError('SSE 연결 실패', error, {});
      setErrorMessage('실시간 연결에 실패했습니다.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerId]);

  // 상태 조회 API
  const checkAnswerStatus = async (answerIdToCheck: number) => {
    try {
      const statusUrl = `/api/answers/${answerIdToCheck}/status`;
      const fullStatusUrl = `${API_BASE_URL}${statusUrl}`;

      console.log('📡 [상태 조회] API 요청:', {
        url: statusUrl,
        fullUrl: fullStatusUrl,
        baseURL: API_BASE_URL,
        answerId: answerIdToCheck,
      });

      const timestamp = new Date().toISOString();
      const callStack = new Error().stack;
      console.log('📤 [checkAnswerStatus] 상태 조회 API 요청 시작:', {
        url: statusUrl,
        fullUrl: fullStatusUrl,
        method: 'GET',
        answerId: answerIdToCheck,
        timestamp,
        callStack: callStack?.split('\n').slice(0, 10).join('\n'),
      });

      const response = await apiClient.get<{
        status: string;
        text?: string;
        audioUrl?: string;
      }>(statusUrl);

      const data = response.data;
      console.log('✅ [checkAnswerStatus] 상태 조회 API 응답 성공:', {
        url: statusUrl,
        status: response.status,
        data: data,
        timestamp: new Date().toISOString(),
      });

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
          if (data.text) {
          setConvertedText(data.text);
          }
          setSTTStatus('COMPLETED');
          setRecordingState('completed');

          // ✅ STT 완료 후 SSE 연결 닫기 (더 이상 필요 없음)
          if (sseRef.current) {
            console.log('🔌 [SSE] 상태 조회로 STT 완료 확인 - SSE 연결 종료');
            sseRef.current.close();
            sseRef.current = null;
          }
          sseTokenRequestRef.current = false; // 연결 종료 시 플래그 해제
          isConnectingSSERef.current = false; // 연결 종료 시 플래그 해제

          // ⚠️ 중요: checkAnswerStatus는 이미 제출된 답변의 상태를 확인하는 것이므로
          // onAnswerComplete에 alreadySubmitted=true 플래그를 전달하여
          // 상위 컴포넌트가 중복 제출하지 않도록 함
          // answerId와 feedbackId는 동일한 값으로 사용됨
          // ✅ 서버 URL을 state에 저장 (SSE 이벤트에서 사용)
          if (data.audioUrl) {
            setServerAudioUrl(data.audioUrl);
          }

          if (onAnswerComplete && data.audioUrl) {
            console.log('📤 [checkAnswerStatus] onAnswerComplete 호출:', {
              audioUrl: data.audioUrl,
              audioUrlType: data.audioUrl.startsWith('blob:')
                ? 'blob URL (⚠️ 문제)'
                : '서버 URL (✅ 정상)',
              text: data.text,
              alreadySubmitted: true,
              feedbackId: feedbackId || answerIdToCheck,
              note: '상태 조회로 확인된 답변 - 서버 URL 사용',
            });
            onAnswerComplete(
              data.audioUrl,
              data.text,
              true, // alreadySubmitted = true (이미 제출된 상태)
              feedbackId || answerIdToCheck || undefined // 저장된 feedbackId 우선 사용
            );
          }
          break;

        default:
          setErrorMessage('알 수 없는 상태입니다.');
      }
    } catch (error) {
      logError('상태 조회 실패', error, { answerIdToCheck });
      // ⚠️ 요구사항: 상태 조회 API도 실패하면 사용자에게 "연결 오류" 최종 에러 메세지 전달
      setErrorMessage('연결 오류가 발생했습니다. 페이지를 새로고침해주세요.');
      setRecordingState('error');
      setSTTStatus('FAILED_STT');
    }
  };

  // 1. 메모리 누수 방지 및 SSE 연결 관리 (필수)
  useEffect(() => {
    // ⚠️ 요구사항: 페이지 진입 시 GET /api/sse/connect 연결
    // POST /api/answers 응답이 PENDING_STT일 때 재사용하기 위해 미리 연결
    console.log('🔌 [SSE] 페이지 진입 시 SSE 연결 시작 (요구사항)');
    if (!sseRef.current || sseRef.current.readyState === EventSource.CLOSED) {
      connectSSE();
    }

    return () => {
      // ⚠️ 요구사항: 이탈 시 해제
      console.log('🔌 [SSE] 페이지 이탈 시 SSE 연결 해제 (요구사항)');
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
  }, [audioUrl, connectSSE]);

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
      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (!validateFileSize(webmBlob)) {
          setRecordingState('error');
          return;
        }

        logInfo('녹음 완료 (webm)', {
          size: webmBlob.size,
          duration: recordingTime,
          type: webmBlob.type,
        });

        // 오디오 변환 시도 (OGG 형식으로 변환)
        try {
          console.log('🔄 [오디오 변환] webm → ogg 변환 시작...');

          const oggBlob = await convertWebmToOgg(webmBlob);

          console.log('✅ [오디오 변환] OGG 변환 완료:', {
            원본크기: webmBlob.size,
            변환크기: oggBlob.size,
            원본타입: webmBlob.type,
            변환타입: oggBlob.type,
            압축률: `${((1 - oggBlob.size / webmBlob.size) * 100).toFixed(1)}%`,
          });

          setAudioBlob(oggBlob);
          const url = URL.createObjectURL(oggBlob);
        setAudioUrl(url);
          // ⚠️ blob URL은 onAudioUrlChange로 전달하지 않음
          // 서버에 업로드된 실제 URL만 전달해야 함
        setRecordingState('processing');

          // ✅ 오디오 변환 완료 후 자동으로 업로드 및 제출 시작
          console.log('🚀 [녹음 완료] 오디오 변환 완료 - 업로드 및 제출 시작');
          uploadToServer();
        } catch (error) {
          console.warn('⚠️ [오디오 변환 실패] webm을 그대로 사용합니다:', error);
          // 변환 실패 시 원본 webm 사용
          setAudioBlob(webmBlob);
          const url = URL.createObjectURL(webmBlob);
          setAudioUrl(url);
          // ⚠️ blob URL은 onAudioUrlChange로 전달하지 않음
          // 서버에 업로드된 실제 URL만 전달해야 함
          setRecordingState('processing');

          // ✅ 오디오 변환 실패해도 원본 webm으로 업로드 및 제출 시작
          console.log('🚀 [녹음 완료] 원본 webm 사용 - 업로드 및 제출 시작');
          uploadToServer();
        }
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

      // ⚠️ 중요: 녹음 종료 시에는 SSE 연결을 닫지 않음
      // SSE 연결은 STT 이벤트(sttCompleted/sttFailed)를 받은 후에만 닫아야 함
      // 녹음 종료 → 업로드 → POST /api/answers → SSE 연결 시작 → STT 이벤트 대기
      // 이 순서로 진행되므로, 녹음 종료 시점에는 아직 SSE 연결이 시작되지 않았을 수 있음
      // 만약 이미 SSE 연결이 있다면 (이전 답변의 연결), STT 이벤트를 받을 때까지 유지해야 함
      if (sseRef.current) {
        const readyState = sseRef.current.readyState;
        console.log('⚠️ [SSE] 녹음 종료 시점에 SSE 연결이 존재합니다:', {
          readyState: readyState,
          readyStateMeaning:
            readyState === EventSource.OPEN
              ? 'OPEN'
              : readyState === EventSource.CONNECTING
                ? 'CONNECTING'
                : 'CLOSED',
          note: 'STT 이벤트를 받을 때까지 SSE 연결을 유지합니다. 이벤트 수신 전에 닫으면 안 됩니다.',
        });
        // SSE 연결을 닫지 않음 - STT 이벤트를 받을 때까지 유지
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

    // ⚠️ 중복 호출 방지: 이미 업로드 중이면 무시
    if (isUploading) {
      console.warn('⚠️ [업로드] 이미 업로드 중입니다. 중복 호출을 무시합니다.');
      return;
    }

    try {
      setIsUploading(true); // 업로드 시작 플래그 설정
      setRecordingState('uploading');
      setUploadProgress(0);

      // 1. Pre-signed URL 획득
      logInfo('Pre-signed URL 요청 시작');

      // 파일명 생성 (timestamp 기반)
      // 실제 파일 형식에 맞는 확장자 사용
      const timestamp = Date.now();

      // audioBlob의 실제 타입 확인
      const actualFileType = audioBlob.type;
      let extension = '.ogg'; // 기본값 (OGG 형식)

      if (actualFileType.includes('ogg')) {
        extension = '.ogg';
      } else if (actualFileType.includes('wav')) {
        extension = '.wav';
      } else if (actualFileType.includes('webm')) {
        extension = '.webm';
      }

      const fileName = `audio_${timestamp}${extension}`;

      console.log('📝 [파일명 생성] 실제 파일 타입 기반:', {
        audioBlobType: actualFileType,
        선택된확장자: extension,
        파일명: fileName,
        note: '실제 파일 형식에 맞는 확장자를 사용합니다.',
      });

      // 파일명 최종 검증
      console.log('📝 [파일명 최종 검증]', {
        최종파일명: fileName,
        확장자: fileName.split('.').pop(),
        타임스탬프: timestamp,
        audioBlobType: audioBlob.type,
        파일크기: audioBlob.size,
      });

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const requestUrl = `${API_BASE_URL}/api/answers/upload-url?fileName=${encodeURIComponent(fileName)}`;

      console.log('📤 [Pre-signed URL 요청]', {
        url: '/api/answers/upload-url',
        apiBaseUrl: API_BASE_URL,
        fullUrl: requestUrl,
        method: 'GET',
        fileName: fileName,
        fileName확장자: fileName.split('.').pop(),
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

        // 먼저 fileName으로 시도 (원래 로직 유지)
        let response;
        try {
          const timestamp = new Date().toISOString();
          const callStack = new Error().stack;
          console.log('🔄 [Pre-signed URL 요청 시도 1] fileName 사용:', {
            url: '/api/answers/upload-url',
            fullUrl: `${API_BASE_URL}/api/answers/upload-url?fileName=${encodeURIComponent(fileName)}`,
            method: 'GET',
            params: { fileName },
            timestamp,
            callStack: callStack?.split('\n').slice(0, 10).join('\n'),
          });
          response = await apiClient.get<{ preSignedUrl: string; finalAudioUrl: string }>(
            '/api/answers/upload-url',
            {
              params: { fileName },
            }
          );
          console.log('✅ [Pre-signed URL 요청 성공 1]', {
            url: '/api/answers/upload-url',
            status: response.status,
            timestamp: new Date().toISOString(),
          });
          // ✅ 성공하면 여기서 끝 (두 번째 시도 없음)
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

          // 400 또는 404 에러인 경우에만 file_name으로 재시도
          if (error.response?.status === 400 || error.response?.status === 404) {
            const retryTimestamp = new Date().toISOString();
            const retryCallStack = new Error().stack;
            console.log('⚠️ [재시도] fileName으로 실패, file_name으로 재시도:', {
              url: '/api/answers/upload-url',
              fullUrl: `${API_BASE_URL}/api/answers/upload-url?file_name=${encodeURIComponent(fileName)}`,
              method: 'GET',
              params: { file_name: fileName },
              timestamp: retryTimestamp,
              callStack: retryCallStack?.split('\n').slice(0, 10).join('\n'),
            });
            try {
              response = await apiClient.get<{ preSignedUrl: string; finalAudioUrl: string }>(
                '/api/answers/upload-url',
                {
                  params: { file_name: fileName },
                }
              );
              console.log('✅ [재시도 성공] file_name 사용:', {
                url: '/api/answers/upload-url',
                status: response.status,
                timestamp: new Date().toISOString(),
              });
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
            // 400/404가 아닌 다른 에러는 바로 throw (재시도 안 함)
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

        // ✅ 서버에 업로드된 실제 URL을 state에 저장 (SSE 이벤트에서 사용)
        setServerAudioUrl(serverAudioUrl);

        // ✅ 서버에 업로드된 실제 URL을 상위 컴포넌트에 알림
        // 이제 버튼이 활성화되어 제출할 수 있음
        if (onAudioUrlChange && serverAudioUrl) {
          console.log('📤 [RecordAnswer] 서버 URL 전달:', {
            serverAudioUrl,
            note: '서버에 업로드된 실제 URL을 상위 컴포넌트에 전달합니다.',
          });
          onAudioUrlChange(serverAudioUrl);
        }

        // 3. 답변 제출
        if (!questionId) {
          throw new Error('질문 ID가 필요합니다.');
        }

        // answerText 처리: 음성 답변의 경우 STT 변환이 완료되기 전에는 비어있을 수 있음
        const finalAnswerText = convertedText || answerText || '';

        // 음성 답변의 경우: STT 변환이 완료되기 전에는 answerText가 비어있을 수 있음
        // 백엔드가 audioUrl이 있으면 answerText를 선택적으로 처리하는지 확인 필요
        if (!finalAnswerText || finalAnswerText.trim() === '') {
          if (serverAudioUrl) {
            // 음성 답변인 경우 - STT 변환 대기 중
            console.log('ℹ️ [답변 제출] 음성 답변 - STT 변환 대기 중:', {
              convertedText,
              answerText,
              finalAnswerText,
              audioUrl: serverAudioUrl,
              note: '음성 답변의 경우 STT 변환이 완료되기 전에는 answerText가 비어있을 수 있습니다. 백엔드가 audioUrl이 있으면 answerText를 선택적으로 처리하는지 확인 필요.',
            });
          } else {
            // 텍스트 답변인데 answerText가 비어있음 - 문제 가능성
            console.warn('⚠️ [답변 제출] 텍스트 답변인데 answerText가 비어있습니다:', {
              convertedText,
              answerText,
              finalAnswerText,
              note: '텍스트 답변의 경우 answerText는 필수 필드일 수 있습니다.',
            });
          }
        }

        const requestBody = {
          questionId,
          answerText: finalAnswerText, // 빈 문자열이어도 전송 (백엔드가 처리)
          audioUrl: serverAudioUrl,
          followUp: followUp ?? false, // 질문 응답의 followUp 값 사용
        };

        // ✅ POST /api/answers 요청 Body 로그 (백엔드 요구사항 확인용)
        console.log('📤 [POST /api/answers] Request Body:', {
          questionId: requestBody.questionId,
          answerText: requestBody.answerText,
          audioUrl: requestBody.audioUrl,
          followUp: requestBody.followUp,
          전체Body: requestBody,
          JSON형식: JSON.stringify(requestBody, null, 2),
        });

        // Validation 체크: questionId가 필수인지 확인
        if (!questionId || typeof questionId !== 'number') {
          console.error('❌ [답변 제출] questionId가 유효하지 않습니다:', questionId);
          throw new Error('questionId가 필요합니다.');
        }

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

          const submitTimestamp = new Date().toISOString();
          const submitCallStack = new Error().stack;
          console.log('📤 [RecordAnswer] POST /api/answers 요청 시작:', {
            url: '/api/answers',
            fullUrl: `${API_BASE_URL}/api/answers`,
            method: 'POST',
            requestBody,
            timestamp: submitTimestamp,
            callStack: submitCallStack?.split('\n').slice(0, 10).join('\n'),
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

          // 답변 ID 및 피드백 ID 저장
          setAnswerId(result.answerId);
          setFeedbackId(result.feedbackId); // feedbackId 저장 (SSE 이벤트에서 사용)

          // 응답 상태 확인
          if (result.status === 'PENDING_STT') {
            console.log('✅ [POST /api/answers 응답] STT 변환 대기 중 상태:', {
              answerId: result.answerId,
              feedbackId: result.feedbackId,
              status: result.status,
              audioUrl: serverAudioUrl,
              note: '백엔드가 네이버로 STT 변환 요청을 보냈습니다. 네이버가 변환 완료되면 백엔드가 SSE로 알려줍니다.',
            });
            setRecordingState('pending_stt');
            setSTTStatus('PENDING_STT');

            // ⚠️ 요구사항: POST /api/answers에 대한 응답 (status=PENDING_STT) -> "텍스트 변환 처리 중"
            // 페이지 진입 시 이미 SSE 연결이 되어있으므로 재사용
            // 만약 연결이 닫혀있으면 재연결
            if (!sseRef.current || sseRef.current.readyState === EventSource.CLOSED) {
              console.log('🔌 [SSE] STT 변환 완료 알림을 받기 위해 SSE 재연결:', {
                answerId: result.answerId,
                feedbackId: result.feedbackId,
                status: result.status,
                note: '페이지 진입 시 연결된 SSE가 닫혀있어 재연결합니다.',
              });
              logInfo('STT 대기 중 - SSE 재연결');
              connectSSE();
            } else {
              console.log('✅ [SSE] 페이지 진입 시 연결된 SSE 재사용:', {
                readyState: sseRef.current.readyState,
                readyStateMeaning:
                  sseRef.current.readyState === EventSource.OPEN
                    ? 'OPEN (연결됨)'
                    : sseRef.current.readyState === EventSource.CONNECTING
                      ? 'CONNECTING (연결 중)'
                      : 'CLOSED (닫힘)',
                url: sseRef.current.url,
                note: '페이지 진입 시 연결된 SSE를 재사용하여 STT 변환 완료 이벤트를 기다립니다.',
              });
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
            // ✅ 서버 URL을 state에 저장 (SSE 이벤트에서 사용)
            setServerAudioUrl(serverAudioUrl);

            if (onAnswerComplete) {
              console.log('📤 [RecordAnswer] onAnswerComplete 호출 (즉시 완료):', {
                audioUrl: serverAudioUrl,
                audioUrlType: serverAudioUrl.startsWith('blob:')
                  ? 'blob URL (⚠️ 문제)'
                  : '서버 URL (✅ 정상)',
                alreadySubmitted: true,
                feedbackId: result.feedbackId,
                note: 'RecordAnswer에서 이미 제출 완료 - 서버 URL 사용',
              });
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
    } finally {
      // ⚠️ 중요: 업로드 완료(성공/실패 모두) 후 플래그 리셋
      setIsUploading(false);
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
