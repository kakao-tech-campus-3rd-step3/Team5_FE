import { http, HttpResponse, passthrough } from 'msw';

// TODO: mock api 수정
export const handlers = [
  // 개발용 토큰 획득 API (MSW 목업)
  http.get('*/api/dev/token', ({ request }) => {
    const url = new URL(request.url);
    const password = url.searchParams.get('password');

    if (!password || password !== 'dev-password') {
      return HttpResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // 목업 토큰 생성
    const accessToken = `mock-access-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;

    console.log('✅ [MSW] 개발용 토큰 발급 성공');
    console.log('🔑 Access Token:', accessToken);
    console.log('🔑 Refresh Token:', refreshToken);

    return HttpResponse.json({
      accessToken,
      refreshToken,
    });
  }),

  // 리프레시 토큰 API (MSW 목업)
  http.post('*/api/token/refresh', async ({ request }) => {
    const body = (await request.json()) as { refresh_token?: string };
    const refreshToken = body.refresh_token;

    if (!refreshToken || !refreshToken.startsWith('mock-refresh-token-')) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    // 새로운 토큰 생성
    const newAccessToken = `mock-access-token-${Date.now()}`;
    const newRefreshToken = `mock-refresh-token-${Date.now()}`;

    console.log('✅ [MSW] 토큰 갱신 성공');
    console.log('🔑 New Access Token:', newAccessToken);
    console.log('🔑 New Refresh Token:', newRefreshToken);

    return HttpResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }),

  // 실제 백엔드로 전달해야 하는 API들 (MSW 가로채기 방지)
  http.get('*/api/sse/connect', () => passthrough()),
  http.get('*/api/answers', () => passthrough()),
  http.get('*/api/answers/:id', () => passthrough()),
  http.get('*/api/answers/:id/status', () => passthrough()),
  http.post('*/api/answers', () => passthrough()),
  http.patch('*/api/answers/:id', () => passthrough()),
  http.patch('*/api/answers/:id/level', () => passthrough()),
  http.post('*/api/answers/:id/retry-stt', () => passthrough()),
  http.post('*/api/stt/callback/:sttTaskId', () => passthrough()),
  http.get('*/api/questions/random', () => passthrough()),
  http.get('*/api/user', () => passthrough()),

  // Pre-signed URL 획득 API는 실제 백엔드로 전달
  http.get('*/api/answers/upload-url', () => passthrough()),

  // Pre-signed URL로 파일 업로드 (PUT 요청 목업)
  http.put('*/api/mock/upload/*', async ({ request }) => {
    const file = await request.blob();
    console.log('✅ [MSW] 파일 업로드 성공');
    console.log('📦 파일 크기:', file.size, 'bytes');
    console.log('📦 파일 타입:', file.type);

    return new HttpResponse(null, { status: 200 });
  }),

  // Home(질문) 페이지 questions 가져오기 (목업 사용 시 주석 해제)
  // http.get(getApiPath('/api/questions/random'), () => {
  //   return HttpResponse.json({
  //     questionId: 123,
  //     questionType: 'FLOW',
  //     flowPhase: 'INTRO',
  //     questionText: '1분 자기소개를 해주세요.',
  //     jobId: 10,
  //   });
  // }),
  // Home(질문) 페이지 users 가져오기 (목업 사용 시 주석 해제)
  // http.get(getApiPath('/api/user'), () => {
  //   return HttpResponse.json({
  //     user: {
  //       user_id: 1,
  //       email: 'me@x.com',
  //       name: 'Hyoseok',
  //       role: 'FREE',
  //       streak: 3,
  //       solved_today: 0,
  //     },
  //     preferences: {
  //       daily_question_limit: 1,
  //       question_mode: 'FLOW',
  //       answer_type: 'VOICE',
  //       time_limit_seconds: 180,
  //       notify_time: '20:30',
  //       allow_push: true,
  //     },
  //     jobs: [
  //       {
  //         job_id: 10,
  //         job_name: 'FE_WEB',
  //       },
  //       {
  //         job_id: 11,
  //         job_name: 'BE_NODE',
  //       },
  //     ],
  //     flow_progress: {
  //       next_phase: 'TECH1',
  //       updated_at: '2025-09-05T07:10:00Z',
  //     },
  //   });
  // }),
  // Archive 질문(피드백) 가져오기 (목업 사용 시 주석 해제)
  // http.get(`${API_BASE_URL}/api/answers`, () => {
  //   return HttpResponse.json({
  //     items: [
  //       {
  //         answerId: 101,
  //         questionId: 201,
  //         questionText: 'SQL Injection 공격과 예방 방법을 설명하세요.',
  //         question_type: 'TECH',
  //         flow_phase: null,
  //         level: 4,
  //         starred: true,
  //         createdAt: '2025-09-27T10:00:00Z',
  //       },
  //       {
  //         answerId: 102,
  //         questionId: 202,
  //         questionText: 'Load Balancing의 종류와 각각의 특징을 설명하세요.',
  //         question_type: 'TECH',
  //         flow_phase: null,
  //         level: 4,
  //         starred: false,
  //         createdAt: '2025-09-26T14:30:00Z',
  //       },
  //       {
  //         answerId: 103,
  //         question_id: 203,
  //         questionText: 'React의 Virtual DOM을 설명해 주세요.',
  //         question_type: 'TECH',
  //         flow_phase: null,
  //         level: 4,
  //         starred: true,
  //         answered_time: '2025-09-05T07:30:00Z',
  //       },
  //       {
  //         answerId: 104,
  //         question_id: 204,
  //         questionText: 'React의 Virtual DOM을 설명해 주세요.',
  //         question_type: 'TECH',
  //         flow_phase: null,
  //         level: 4,
  //         starred: true,
  //         answered_time: '2025-09-05T07:30:00Z',
  //       },
  //       {
  //         answerId: 105,
  //         question_id: 205,
  //         questionText: 'React의 Virtual DOM을 설명해 주세요.',
  //         question_type: 'TECH',
  //         flow_phase: null,
  //         level: 4,
  //         starred: true,
  //         answered_time: '2025-09-05T07:30:00Z',
  //       },
  //     ],
  //     hasNext: false,
  //   });
  // }),
  // 답변 제출 API (목업 사용 시 주석 해제)
  // http.post('*/api/answers', async ({ request }) => {
  //   const body = (await request.json()) as any;
  //   console.log('✅ [백엔드] 답변 제출 성공 - POST /api/answers');
  //   console.log('📝 요청 데이터:', {
  //     questionId: body.questionId,
  //     answerText: body.answerText,
  //     audioUrl: body.audioUrl || '없음',
  //     followUp: body.followUp ?? false
  //   });
  //
  //   return HttpResponse.json({
  //     answerId: 9007199254740991,
  //     answerText: body.answerText,
  //     feedbackId: 9007199254740991
  //   }, { status: 201 });
  // }),
  // Rival 검색 API
  http.get('*/api/rivals/search', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (email === 'test@example.com') {
      return HttpResponse.json({
        userId: 12345,
        email: 'test@example.com',
        name: '테스트 유저',
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
      answeredQuestions: 28,
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
      email: `following${i + 1}@example.com`,
    }));

    return HttpResponse.json({
      items: mockItems,
      nextCursor: mockItems[mockItems.length - 1].userId,
      hasNext: true,
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
      email: `follower${i + 1}@example.com`,
    }));

    return HttpResponse.json({
      items: mockItems,
      nextCursor: mockItems[mockItems.length - 1].userId,
      hasNext: true,
    });
  }),
  // 라이벌 추가 (팔로우) API
  http.post('*/api/rivals/:targetUserId', ({ params }) => {
    const { targetUserId } = params;
    console.log(`✅ [백엔드] 라이벌 추가 성공 - POST /api/rivals/${targetUserId}`);

    return HttpResponse.json(
      {
        rivalId: Math.floor(Math.random() * 1000000),
        senderId: 1,
        senderName: '나',
        receiverId: Number(targetUserId),
        receiverName: '테스트 유저',
      },
      { status: 201 }
    );
  }),
  // 라이벌 삭제 (언팔로우) API
  http.delete('*/api/rivals/:targetUserId', ({ params }) => {
    const { targetUserId } = params;
    console.log(`✅ [백엔드] 라이벌 삭제 성공 - DELETE /api/rivals/${targetUserId}`);

    return new HttpResponse(null, { status: 200 });
  }),

  // TODO: 음성 답변 관련 API는 실제 백엔드 서버로 요청
  // - /api/answers (POST) - 실제 백엔드
  // - /api/answers/upload-url (GET) - 실제 백엔드
  // - /api/answers/:id/retry-stt (POST) - 실제 백엔드
  // - /api/answers/:id/status (GET) - 실제 백엔드
  // - /api/sse/connect (GET) - 실제 백엔드

  // TODO: 본인이 사용 할 핸들러를 자유롭게 추가합니다.
];
