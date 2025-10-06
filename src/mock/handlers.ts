import { http, HttpResponse } from 'msw';
// import { API_BASE_URL } from '../api/apiClient';

export const handlers = [
  // Home(질문) 페이지 questions 가져오기
  http.get('*/api/questions/random', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    if (userId === '1') {
      return HttpResponse.json({
        questionId: 123,
        questionType: 'FLOW',
        flowPhase: 'INTRO',
        questionText: '1분 자기소개를 해주세요.',
        jobId: 10,
      });
    }
  }),
  // Home(질문) 페이지 users 가져오기
  http.get('*/api/user', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (userId === '1') {
      return HttpResponse.json({
        user: {
          user_id: 1,
          email: 'me@x.com',
          name: 'Hyoseok',
          role: 'FREE',
          streak: 3,
          solved_today: 0,
        },
        preferences: {
          daily_question_limit: 1,
          question_mode: 'FLOW',
          answer_type: 'VOICE',
          time_limit_seconds: 180,
          notify_time: '20:30',
          allow_push: true,
        },
        jobs: [
          {
            job_id: 10,
            job_name: 'FE_WEB',
          },
          {
            job_id: 11,
            job_name: 'BE_NODE',
          },
        ],
        flow_progress: {
          next_phase: 'TECH1',
          updated_at: '2025-09-05T07:10:00Z',
        },
      });
    }
  }),
  // Archive 질문(피드백) 가져오기
  http.get('*/api/answers', ({ request }) => {
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
            starred: 1,
            answered_time: '2025-09-05T07:30:00Z',
          },
          {
            answerId: 104,
            question_id: 204,
            questionText: 'React의 Virtual DOM을 설명해 주세요.',
            question_type: 'TECH',
            flow_phase: null,
            level: 4,
            starred: 1,
            answered_time: '2025-09-05T07:30:00Z',
          },
          {
            answerId: 105,
            question_id: 205,
            questionText: 'React의 Virtual DOM을 설명해 주세요.',
            question_type: 'TECH',
            flow_phase: null,
            level: 4,
            starred: 1,
            answered_time: '2025-09-05T07:30:00Z',
          },
        ],
        hasNext: false,
      });
    }
  }),

  // Archive 질문(피드백) 상세 페이지
  http.get('*/api/answers', ({ request }) => {
    const url = new URL(request.url);
    const answerId = url.searchParams.get('answerId');
    if (answerId) {
      return HttpResponse.json({
        memo: 'string',
        starred: true,
        level: 1073741824,
      });
    }
  }),
  // TODO: 본인이 사용 할 핸들러를 자유롭게 추가합니다.
];
