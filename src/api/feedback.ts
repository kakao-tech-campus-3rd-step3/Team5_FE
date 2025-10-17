import apiClient from './apiClient';

export interface PostAnswerData {
  answerId: number;
  answerText: string;
  feedbackId: number;
}

export interface GetFeedbackData {
  overallEvaluation: string;
  positivePoints: string[];
  pointsForImprovement: string[];
}

export const postAnswer = async (userId: number, questionId: number, answerText: string) => {
  const response = await apiClient.post<PostAnswerData>(`/answers?user_id=${userId}`, {
    questionId,
    answerText,
    audioUrl: '',
  });
  return response.data;
};

export const getFeedback = async (feedbackId: number) => {
  const response = await apiClient.get<GetFeedbackData>(`/feedback/${feedbackId}`);
  return response.data;
};