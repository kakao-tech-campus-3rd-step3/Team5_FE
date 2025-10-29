import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../api/apiClient';

// MSW에서는 상대 경로 사용 (API_BASE_URL이 빈 문자열일 수 있음)
const getApiPath = (path: string) => API_BASE_URL ? `${API_BASE_URL}${path}` : path;

// TODO: mock api 수정
export const handlers = [
  // Home(질문) 페이지 questions 가져오기
  http.get(getApiPath('/api/questions/random'), () => {
    return HttpResponse.json({
      questionId: 123,
      questionType: 'FLOW',
      flowPhase: 'INTRO',
      questionText: '1분 자기소개를 해주세요.',
      jobId: 10,
    });
  }),
  // Home(질문) 페이지 users 가져오기
  http.get(getApiPath('/api/user'), () => {
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
  }),
  // Archive 질문(피드백) 가져오기
  http.get(`${API_BASE_URL}/api/answers`, () => {
    return HttpResponse.json({
      items: [
        {
          answerId: 101,
          questionId: 201,
          questionText: 'SQL Injection 공격과 예방 방법을 설명하세요.',
          question_type: 'TECH',
          flow_phase: null,
          level: 4,
          starred: true,
          createdAt: '2025-09-27T10:00:00Z',
        },
        {
          answerId: 102,
          questionId: 202,
          questionText: 'Load Balancing의 종류와 각각의 특징을 설명하세요.',
          question_type: 'TECH',
          flow_phase: null,
          level: 4,
          starred: false,
          createdAt: '2025-09-26T14:30:00Z',
        },
        {
          answerId: 103,
          question_id: 203,
          questionText: 'React의 Virtual DOM을 설명해 주세요.',
          question_type: 'TECH',
          flow_phase: null,
          level: 4,
          starred: true,
          answered_time: '2025-09-05T07:30:00Z',
        },
        {
          answerId: 104,
          question_id: 204,
          questionText: 'React의 Virtual DOM을 설명해 주세요.',
          question_type: 'TECH',
          flow_phase: null,
          level: 4,
          starred: true,
          answered_time: '2025-09-05T07:30:00Z',
        },
        {
          answerId: 105,
          question_id: 205,
          questionText: 'React의 Virtual DOM을 설명해 주세요.',
          question_type: 'TECH',
          flow_phase: null,
          level: 4,
          starred: true,
          answered_time: '2025-09-05T07:30:00Z',
        },
      ],
      hasNext: false,
    });
  }),
  // 답변 제출 API
  http.post('*/api/answers', async ({ request }) => {
    const body = (await request.json()) as any;
    console.log('✅ [백엔드] 답변 제출 성공 - POST /api/answers');
    console.log('📝 요청 데이터:', {
      questionId: body.questionId,
      answerText: body.answerText,
      audioUrl: body.audioUrl || '없음'
    });
    
    return HttpResponse.json({
      answerId: 9007199254740991,
      answerText: body.answerText,
      feedbackId: 9007199254740991
    }, { status: 201 });
  }),
  // Rival 검색 API
  http.get('*/api/rivals/search', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (email === 'test@example.com') {
      return HttpResponse.json({
        userId: 12345,
        email: 'test@example.com',
        name: '테스트 유저'
      });
    }
    
    return HttpResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }),
  // Rival 프로필 조회 API
  http.get('*/api/rivals/:userId/profile', ({ params }) => {
    const { userId } = params;
    
    return HttpResponse.json({
      userId: Number(userId),
      email: 'test@example.com',
      name: '테스트 유저',
      intro: '안녕하세요! 열심히 공부하는 개발자입니다.',
      dailyQDays: 15,
      answeredQuestions: 28
    });
  }),
  // 팔로잉 목록 조회 API
  http.get('*/api/rivals/following', ({ request }) => {
    const url = new URL(request.url);
    const lastId = url.searchParams.get('lastId');
    const limit = Number(url.searchParams.get('limit')) || 10;
    
    const mockItems = Array.from({ length: limit }, (_, i) => ({
      userId: (lastId ? Number(lastId) : 0) + i + 1,
      name: `팔로잉 유저 ${i + 1}`,
      email: `following${i + 1}@example.com`
    }));
    
    return HttpResponse.json({
      items: mockItems,
      nextCursor: mockItems[mockItems.length - 1].userId,
      hasNext: true
    });
  }),
  // 팔로워 목록 조회 API
  http.get('*/api/rivals/followed', ({ request }) => {
    const url = new URL(request.url);
    const lastId = url.searchParams.get('lastId');
    const limit = Number(url.searchParams.get('limit')) || 10;
    
    const mockItems = Array.from({ length: limit }, (_, i) => ({
      userId: (lastId ? Number(lastId) : 0) + i + 1,
      name: `팔로워 유저 ${i + 1}`,
      email: `follower${i + 1}@example.com`
    }));
    
    return HttpResponse.json({
      items: mockItems,
      nextCursor: mockItems[mockItems.length - 1].userId,
      hasNext: true
    });
  }),
  // 라이벌 추가 (팔로우) API
  http.post('*/api/rivals/:targetUserId', ({ params }) => {
    const { targetUserId } = params;
    console.log(`✅ [백엔드] 라이벌 추가 성공 - POST /api/rivals/${targetUserId}`);
    
    return HttpResponse.json({
      rivalId: Math.floor(Math.random() * 1000000),
      senderId: 1,
      senderName: '나',
      receiverId: Number(targetUserId),
      receiverName: '테스트 유저'
    }, { status: 201 });
  }),
  // 라이벌 삭제 (언팔로우) API
  http.delete('*/api/rivals/:targetUserId', ({ params }) => {
    const { targetUserId } = params;
    console.log(`✅ [백엔드] 라이벌 삭제 성공 - DELETE /api/rivals/${targetUserId}`);
    
    return new HttpResponse(null, { status: 200 });
  }),

  // 답변 제출 API (음성/텍스트)
  http.post(getApiPath('/api/answers'), async ({ request }) => {
    const body = await request.json();
    console.log('📝 답변 제출 요청:', body);
    
    return HttpResponse.json({
      answerId: 'mock-answer-' + Date.now(),
      feedbackId: 456,
      status: 'PENDING_STT',
      message: '답변이 성공적으로 제출되었습니다.'
    });
  }),

  // Pre-signed URL 획득 API
  http.get(getApiPath('/api/answers/upload-url'), () => {
    console.log('📤 Pre-signed URL 요청');
    
    return HttpResponse.json({
      preSignedUrl: 'https://mock-s3-bucket.com/upload-url',
      audioUrl: 'mock-audio-url-' + Date.now()
    });
  }),

  // STT 재시도 API
  http.post(getApiPath('/api/answers/:answerId/retry-stt'), ({ params }) => {
    console.log('🔄 STT 재시도 요청:', params.answerId);
    
    return HttpResponse.json({
      message: 'STT 재시도가 시작되었습니다.',
      status: 'PENDING_STT'
    });
  }),

  // 답변 상태 조회 API
  http.get(getApiPath('/api/answers/:answerId/status'), ({ params }) => {
    console.log('📊 답변 상태 조회:', params.answerId);
    
    return HttpResponse.json({
      answerId: params.answerId,
      status: 'COMPLETED',
      text: '안녕하세요. 저는 프론트엔드 개발자로 3년간 React와 TypeScript를 사용해왔습니다.',
      audioUrl: 'https://mock-audio-storage.com/converted-audio.mp3'
    });
  }),

  // SSE 연결 API (목업)
  http.get(getApiPath('/api/sse/connect'), () => {
    console.log('🔗 SSE 연결 요청');
    
    // SSE는 목업에서 제대로 구현하기 어려우므로 일반 응답 반환
    return HttpResponse.json({
      message: 'SSE 연결이 설정되었습니다. (목업 환경)'
    });
  }),

  // TODO: 본인이 사용 할 핸들러를 자유롭게 추가합니다.
];
