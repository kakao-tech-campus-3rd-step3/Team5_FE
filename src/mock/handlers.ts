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
