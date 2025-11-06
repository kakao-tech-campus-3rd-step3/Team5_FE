import apiClient from './apiClient';

export interface SubmitAnswerRequest {
  questionId: number;
  answerText: string;
  audioUrl?: string; // 음성 답변인 경우
  followUp?: boolean; // 추가 질문 여부
}

export interface SubmitAnswerResponse {
  answerId: number;
  answerText: string;
  status: string; // 'PENDING_STT', 'COMPLETED', 'FAILED_STT' 등
  feedbackId: number;
}

export const submitAnswer = async (data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
  const response = await apiClient.post<SubmitAnswerResponse>('/api/answers', data);
  return response.data;
};

// SSE 토큰 조회 API
export interface SSETokenResponse {
  sseToken: string;
}

export const getSSEToken = async (): Promise<SSETokenResponse> => {
  const timestamp = new Date().toISOString();
  const callStack = new Error().stack;
  console.log('📤 [getSSEToken] SSE 토큰 요청 시작:', {
    url: '/api/sse/token',
    fullUrl: `${import.meta.env.VITE_API_BASE_URL || ''}/api/sse/token`,
    method: 'GET',
    timestamp,
    callStack: callStack?.split('\n').slice(0, 10).join('\n'), // 상위 10줄만
  });

  const response = await apiClient.get<SSETokenResponse>('/api/sse/token');

  console.log('✅ [getSSEToken] SSE 토큰 응답 성공:', {
    url: '/api/sse/token',
    status: response.status,
    statusText: response.statusText,
    sseTokenPreview: response.data.sseToken?.substring(0, 20) + '...',
    timestamp: new Date().toISOString(),
  });

  return response.data;
};

// 오디오 파일 변환 API (webm → ogg)
// 백엔드에 변환 API가 있다면 사용 (선택사항)
export interface ConvertAudioResponse {
  audioUrl: string;
  format: string;
}

export const convertAudioToOgg = async (audioBlob: Blob): Promise<Blob> => {
  // 백엔드 변환 API가 있다면 사용 (선택사항)
  // 예: POST /api/audio/convert
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');
  formData.append('targetFormat', 'ogg');

  try {
    const response = await apiClient.post<Blob>('/api/audio/convert', formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.warn(
      '⚠️ [오디오 변환 API] 백엔드 변환 API가 없거나 실패했습니다. 브라우저 변환을 사용합니다.',
      error
    );
    throw error;
  }
};
