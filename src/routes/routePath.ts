// TODO: 동적 라우팅 적용 (예: /archive/:id, /user/:userId)
export const ROUTE_PATH = {
  HOME: '/',
  ARCHIVE: '/archive', // :id 제거 (필요시 나중에 추가)
  FEEDBACK: '/feedback',
  FEEDBACK_DETAIL: '/feedbackDetail/:id',
  SUBSCRIBE: '/subscribe',
  LOGIN: '/login',
  LOGIN_OAUTH: '/login/oauth',
  RIVAL: '/rival',
  NOTFOUND: '*',
};
