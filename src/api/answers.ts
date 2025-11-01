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
  feedbackId: number;
}

export const submitAnswer = async (data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
  const response = await apiClient.post<SubmitAnswerResponse>('/api/answers', data);
  return response.data;
};
