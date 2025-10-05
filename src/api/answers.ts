import apiClient from './apiClient';

export interface SubmitAnswerRequest {
  questionId: number;
  answerText: string;
  answerType: 'voice' | 'text';
  audioBlob?: Blob; // 음성 답변인 경우
}

export interface SubmitAnswerResponse {
  answerId: number;
  questionId: number;
  answerText: string;
  answerType: 'voice' | 'text';
  createdAt: string;
  status: string;
}

export const submitAnswer = async (data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
  const formData = new FormData();
  
  formData.append('questionId', data.questionId.toString());
  formData.append('answerText', data.answerText);
  formData.append('answerType', data.answerType);
  
  if (data.audioBlob) {
    formData.append('audioFile', data.audioBlob, 'answer.webm');
  }

  const response = await apiClient.post<SubmitAnswerResponse>('/api/answers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
