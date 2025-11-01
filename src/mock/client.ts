import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const client = setupWorker(...handlers);

// MSW 기본 설정
export const mswOptions = {
  onUnhandledRequest: (request: Request, print: { warning: () => void }) => {
    // 루트 경로(/) 요청은 무시 (서버 리다이렉트 등)
    if (request.url.endsWith('/') || request.url.includes('/login')) {
      return;
    }
    // 기타 처리되지 않은 요청은 경고만 출력
    print.warning();
  },
};
