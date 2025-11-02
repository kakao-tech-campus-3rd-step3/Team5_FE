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
  // http.post('*/api/answers', () => passthrough()), // 목업 핸들러로 대체됨
  http.patch('*/api/answers/:id', () => passthrough()),
  http.patch('*/api/answers/:id/level', () => passthrough()),
  http.post('*/api/answers/:id/retry-stt', () => passthrough()),
  http.post('*/api/stt/callback/:sttTaskId', () => passthrough()),
  http.get('*/api/questions/random', () => passthrough()),
  http.get('*/api/user', () => passthrough()),

  // Pre-signed URL 획득 API는 실제 백엔드로 전달
  http.get('*/api/answers/upload-url', () => passthrough()),

  // Archive 질문(피드백) 상세 페이지
  http.get('*/api/answers', ({ request }) => {
    const url = new URL(request.url);
    const answerId = url.searchParams.get('answerId');
    if (answerId) {
      return HttpResponse.json({
        answerId: 9007199254740991,
        question: {
          questionId: 9007199254740991,
          questionType: 'TECH',
          questionText: 'string',
        },
        answerText: 'string',
        level: 1073741824,
        starred: true,
        createdAt: '2025-10-07T11:35:06.685Z',
        feedback: {
          status: 'PENDING',
          content: {
            overallEvaluation: 'string',
            positivePoints: ['string'],
            pointsForImprovement: ['string'],
          },
          updatedAt: '2025-10-07T11:35:06.685Z',
        },
      });
    }
  }),
  // 답변 제출 API
  http.post('*/api/answers', async ({ request }) => {
    const body = await request.json() as {
      questionId: number;
      answerText: string;
      audioUrl?: string;
    };
    
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
    
    // 실제 친구 이름과 이메일 데이터
    const friendNames = [
      '김민수', '이지영', '박준호', '최수진', '정현우',
      '강소영', '윤태호', '임다은', '서준영', '한지민',
      '조성민', '오유진', '신동현', '배수정', '홍민철',
      '송지은', '권태영', '노하늘', '문지훈', '유나영'
    ];
    
    const mockItems = Array.from({ length: limit }, (_, i) => ({
      userId: (lastId ? Number(lastId) : 0) + i + 1,
      name: friendNames[i] || `친구 ${i + 1}`,
      email: `friend${i + 1}@dailyq.com`
    }));
    
    console.log('✅ [백엔드] 팔로잉 목록 반환:', mockItems);
    
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
    
    // 실제 팔로워 이름과 이메일 데이터
    const followerNames = [
      '김철수', '이영희', '박민수', '최지영', '정수진',
      '강동현', '윤소영', '임태호', '서다은', '한준영',
      '조지민', '오성민', '신유진', '배동현', '홍수정',
      '송민철', '권지은', '노태영', '문하늘', '유지훈'
    ];
    
    const mockItems = Array.from({ length: limit }, (_, i) => ({
      userId: (lastId ? Number(lastId) : 0) + i + 1,
      name: followerNames[i] || `팔로워 ${i + 1}`,
      email: `follower${i + 1}@dailyq.com`
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
  // TODO: 본인이 사용 할 핸들러를 자유롭게 추가합니다.
];
