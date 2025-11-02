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
  // TODO: 본인이 사용 할 핸들러를 자유롭게 추가합니다.
];
