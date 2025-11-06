# 멘토님께 질문할 항목들 (우선순위 순)

## 🔴 긴급 (프로젝트 완성에 필수)

### 1. API 명세 확인 필요 항목

#### 1.1 토큰 갱신 API 응답 형식
- **위치**: `src/api/auth.ts`, `src/api/apiClient.ts`
- **문제**: 
  - `refreshAccessToken` API가 정확히 어떤 필드명으로 응답하는지 확인 필요
  - 현재 `extractTokensFromResponse`가 여러 필드명을 시도하지만, 백엔드 명세가 명확하지 않음
- **질문**: `/api/token/refresh` 응답이 정확히 `{ accessToken: "string" }` 형태인가요? `refreshToken`도 함께 반환되나요?

#### 1.2 구독 API 엔드포인트
- **위치**: `src/pages/Subscribe/Subscribe.tsx`
- **문제**: `handleSubscribe` 함수가 TODO로 남아있고, 구독 API 엔드포인트가 없음
- **질문**: 구독 기능은 실제로 구현해야 하나요? API 엔드포인트는 무엇인가요? (POST `/api/subscription` 등)

#### 1.3 답변 제출 후 피드백 생성 시간
- **위치**: `src/pages/Home/Home.tsx`, `src/pages/Feedback/Feedback.tsx`
- **문제**: 답변 제출 후 즉시 피드백 페이지로 이동하는데, 피드백 생성이 비동기라면 로딩 상태 처리가 필요
- **질문**: `POST /api/answers` 후 `feedbackId`가 즉시 반환되나요? 피드백 생성이 완료될 때까지 기다려야 하나요?

#### 1.4 Rival API 응답 형식
- **위치**: `src/pages/Rival/Rival.tsx`, `src/api/rivals.ts`
- **문제**: 
  - `getFollowingList`, `getFollowerList`가 빈 배열을 반환할 때 목 데이터를 보여주도록 처리했지만, 실제 API 응답 구조 확인 필요
  - `nextCursor`와 `hasNext` 필드가 실제로 사용되는지 확인 필요
- **질문**: 
  - 팔로잉/팔로워 목록이 없을 때 빈 배열을 반환하나요, 아니면 다른 상태 코드를 반환하나요?
  - 무한 스크롤을 구현해야 하나요?

#### 1.5 음성 답변 업로드 방식
- **위치**: `src/pages/Home/components/VoiceInput.tsx`, `src/api/answers.ts`
- **문제**: `audioUrl`을 직접 전송하는데, 실제로는 파일 업로드 API가 필요할 수 있음
- **질문**: 
  - 음성 파일은 어떻게 업로드하나요? (별도 파일 업로드 API가 있나요?)
  - `audioUrl`은 클라이언트에서 생성한 Blob URL인데, 서버로 어떻게 전송하나요?

---

## 🟡 중요 (기능 완성도 향상)

### 2. 에러 처리 및 엣지 케이스

#### 2.1 네트워크 에러 처리
- **위치**: `src/api/apiClient.ts` (라인 139-272)
- **문제**: 
  - CORS 에러와 토큰 만료를 구분하는 로직이 복잡함
  - 네트워크 에러 시 사용자에게 적절한 메시지 표시 필요
- **질문**: 
  - 백엔드 서버 다운 시 사용자에게 어떤 메시지를 보여줘야 하나요?
  - CORS 에러가 발생하면 항상 토큰 갱신을 시도하는 것이 맞나요?

#### 2.2 토큰 갱신 실패 시 처리
- **위치**: `src/api/apiClient.ts`, `src/routes/AppRouter.tsx`
- **문제**: 
  - `AppRouter.tsx`의 `tryRefreshToken`과 `apiClient.ts`의 인터셉터에서 중복 처리 가능성
  - 리프레시 토큰도 만료된 경우 사용자 경험 개선 필요
- **질문**: 리프레시 토큰이 만료되면 자동으로 로그인 페이지로 이동하는 것이 최선인가요?

#### 2.3 로딩 상태 관리
- **위치**: 여러 페이지 컴포넌트
- **문제**: 
  - `useFetch`에서 로딩 상태를 제공하지 않음
  - API 호출 중 사용자에게 적절한 피드백 필요
- **질문**: 로딩 스피너나 스켈레톤 UI를 추가해야 하나요?

---

## 🟢 개선 (시간 여유 시)

### 3. 미완성 기능 (TODO)

#### 3.1 AnsweredSection 컴포넌트
- **위치**: `src/pages/Home/Home.tsx` (라인 89)
- **문제**: 답변 후 화면이 미완성 상태
- **질문**: 이 컴포넌트를 구현해야 하나요, 아니면 바로 피드백 페이지로만 이동하나요?

#### 3.2 Archive 페이지 무한 스크롤
- **위치**: `src/pages/Archive/Archive.tsx`
- **문제**: `InfiniteScrollList.tsx`가 삭제되었는데, 무한 스크롤이 필요한지 확인 필요
- **질문**: Archive 페이지에 무한 스크롤을 구현해야 하나요?

#### 3.3 사용자 정보 표시
- **위치**: `src/pages/Home/Home.tsx` (라인 42, 97)
- **문제**: 사용자 정보를 가져오지만 사용하지 않음
- **질문**: 사용자 이름을 화면에 표시해야 하나요?

---

## 🔵 기술적 질문

### 4. 아키텍처 및 최적화

#### 4.1 토큰 갱신 로직 통합
- **위치**: `src/api/apiClient.ts`, `src/routes/AppRouter.tsx`
- **문제**: 두 곳에서 토큰 갱신 로직이 분산되어 있음
- **질문**: 
  - `AppRouter`의 `tryRefreshToken`과 `apiClient` 인터셉터의 중복을 제거해야 하나요?
  - 현재 구조가 적절한가요?

#### 4.2 상태 관리
- **문제**: 전역 상태 관리 라이브러리(Redux, Zustand 등) 없이 `localStorage`와 `useState`만 사용
- **질문**: 인증 상태를 전역으로 관리하는 것이 더 나을까요?

#### 4.3 에러 바운더리
- **문제**: React Error Boundary가 없어서 예상치 못한 에러 발생 시 전체 앱이 크래시될 수 있음
- **질문**: Error Boundary를 추가해야 하나요?

---

## 📋 API 명세 확인 체크리스트

다음 항목들의 정확한 명세를 확인해야 합니다:

- [ ] `/api/token/refresh` - 요청/응답 형식
- [ ] `/api/answers` (POST) - `audioUrl` 처리 방식
- [ ] `/api/feedback/:id` - 피드백 생성 완료 시점
- [ ] `/api/rivals/following` - 빈 목록 응답 형식
- [ ] `/api/rivals/followed` - 빈 목록 응답 형식
- [ ] `/api/subscription` - 구독 API 존재 여부
- [ ] `/api/user` - 사용자 정보 필드

---

## 🎯 우선순위별 작업 계획

### 오늘 (Day 1)
1. ✅ API 명세 확인 (위 체크리스트)
2. ✅ 구독 기능 구현 여부 결정
3. ✅ 음성 답변 업로드 방식 확인
4. ✅ 토큰 갱신 API 응답 형식 확인

### 내일 (Day 2)
1. ✅ 미완성 기능 구현 (AnsweredSection, 구독 등)
2. ✅ 에러 처리 개선
3. ✅ 로딩 상태 추가
4. ✅ 최종 테스트 및 버그 수정

---

## 💡 추가 고려사항

1. **프로덕션 빌드**: `npm run build` 후 배포 환경에서 테스트 필요
2. **환경 변수**: `.env` 파일의 `VITE_API_BASE_URL` 설정 확인
3. **CORS 설정**: 백엔드 CORS 설정이 올바른지 확인
4. **타입 안정성**: `any` 타입 사용 지점 점검 (`src/pages/Home/Home.tsx:51` 등)

