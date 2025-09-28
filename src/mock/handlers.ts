import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../api/apiClient';

export const handlers = [
  // Archive 페이지에서 사용
  http.get(`${API_BASE_URL}/api/answers`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (userId === '1') {
      return HttpResponse.json({
        items: [
          {
            answerId: 101,
            questionId: 201,
            questionText: 'SQL Injection 공격과 예방 방법을 설명하세요.',
            question_type: 'TECH',
            flow_phase: null,
            level: 4,
            starred: 1,
            createdAt: '2025-09-27T10:00:00Z',
          },
          {
            answerId: 102,
            questionId: 202,
            questionText: 'Load Balancing의 종류와 각각의 특징을 설명하세요.',
            question_type: 'TECH',
            flow_phase: null,
            level: 4,
            starred: 0,
            createdAt: '2025-09-26T14:30:00Z',
          },
          {
            answerId: 103,
            question_id: 203,
            questionText: 'React의 Virtual DOM을 설명해 주세요.',
            question_type: 'TECH',
            flow_phase: null,
            level: 4,
            starred: 0,
            answered_time: '2025-09-05T07:30:00Z',
          },
        ],
        hasNext: false,
      });
    }
  }),
  // TODO: 본인이 사용 할 핸들러를 자유롭게 추가합니다.
];
