# 👑 DailyQ

## 1. 서비스 개요

- **서비스명**: **DailyQ**
- **목표**: 취업 준비생이 하루 5분, 하루에 하나씩 면접 질문에 답변하면서
    - **꾸준히 연습하는 습관**을 만들고
    - **AI 피드백**을 통해 부족한 점을 보완하며
    - 면접 실력을 끌어올릴 수 있게 함.
- **핵심 가치**: 무겁지 않은 '1일 1문항' 루틴 → 꾸준한 학습 → 성장 체감 → 동기 유지.

---

## 2. 문제 정의

- **취업 준비생의 학습 패턴 문제**
    - 면접 대비를 꾸준히 하고 싶지만, **매일 무엇을 준비해야 할지 체계가 없음**
    - 자기 답변을 기록하거나 피드백 받을 기회가 부족해, **자신의 성장 정도를 측정하기 어려움**
    - 혼자 공부하다 보니 지루해지고, **동기부여가 금방 떨어져 학습을 중단**하는 경우가 많음
- **기존 서비스의 한계**
    - **모의 면접(예: 사람인 AI 면접)**
        - 1회 단가가 높아 자주 이용하기 어렵고,
        - 실제 학습 루틴으로 이어지기보다는 **일회성 체험**에 머무는 경우가 많음
    - **메일 기반 학습(예: 매일메일)**
        - 사용자가 메일을 열어보지 않으면 학습이 끊김 → **사용자 주도형(passive)** 구조라 지속성이 낮음
        - 짧은 팁 위주의 정보 제공이라, **실제 답변 훈련/피드백 루프**가 부족함
- **결과적으로**
    - 취업 준비생은 **꾸준히 연습할 수 있는 가벼운 루틴**과
    - **즉각적인 피드백과 성취감을 제공하는 도구**를 찾지 못해
    - 학습 지속률이 낮고, **실질적인 역량 향상으로 이어지지 못함**

---

## 3. 솔루션

- 브라우저/앱 실행 시 **자동으로 하루 1문항 노출**
- 답변은 **텍스트/음성** 중 선택 가능 → 음성의 경우 **시간 제한 옵션** 제공
- **AI 피드백**으로 답변의 구조·명확성·근거 강화를 지원
- **아카이브/스트릭/라이벌** 기능으로 성취감·경쟁심 제공
- **꼬리 질문 기능**으로 실제 면접과 유사도 확보

---

## 4. 주요 기능

1. **회원/온보딩**
    - 소셜 로그인(구글/카카오)
    - 원하는 직군 선택 → 직군 내 세부직군 다중 선택
    - [기술 질문] / [면접 플로우 질문] 중 선택
        - [면접 플로우 질문] 선택 시: 보편적 면접 시퀀스 기반 질문 제공
    - 답변 방식(텍스트/음성), 음성의 경우 시간 제한 설정
2. **하루 질문 루틴**
    - 메인 페이지 [오늘의 질문] → 답변 입력(타자/음성)
    - 음성 답변은 자동 STT 처리
    - AI 피드백 + 사용자가 난이도 체크
    - 스트릭 증가
3. **아카이브**
    - 내가 푼 답변/피드백 히스토리
    - 즐겨찾기(핀)/난이도 필터
    - 간단한 메모 작성 기능
4. **동기 부여**
    - 스트릭(연속 기록)
    - 라이벌 지정
5. **유료 서비스**
    - (구독) 일일 질문 한도 추가
        - 면접이 임박한 사용자의 편의성 증대


---

## 5. 기술 흐름

### 5.0 회원가입 및 온보딩 플로우

**주요 단계:**

1. **소셜 로그인 시작**: '카카오/구글 로그인' 버튼 클릭 시 백엔드 인증 URL로 리다이렉트합니다.
2. **토큰 수신**: 인증 완료 후 콜백 URL의 쿼리 파라미터로 전달된 Access Token을 파싱합니다.
3. **토큰 저장**: Access Token을 localStorage와 Axios 인스턴스 헤더에 저장 및 설정합니다.
4. **온보딩 여부 확인**: `GET /api/user API` 를 호출하여 사용자 온보딩 완료 여부를 확인합니다.
5. **온보딩 진행**: 신규 사용자일 경우 `PUT /api/user/jobs`, `PUT /api/user/preferences` API로 설정을 저장합니다.
6. **토큰 갱신**: (Axios 인터셉터) 401 에러 발생 시 `POST /api/token/refresh`로 토큰을 자동 갱신합니다.

**토큰 갱신 플로우:**
- Access Token 만료 시: `POST /api/token/refresh`로 Refresh Token을 사용해 새로운 Access Token 발급
- Refresh Token은 쿠키에서 자동으로 읽어옴

---

### 5.1 질문 조회 플로우

사용자가 메인 페이지에서 오늘의 질문을 받아오는 과정입니다.

**주요 단계:**

1. **질문 요청**: 메인 페이지 진입 시 `GET /api/questions/random` API를 호출하여 질문을 받아옵니다.
2. **질문 렌더링**: 응답받은 질문 데이터를 React `useState`에 저장하여 화면에 렌더링합니다.

---

### 5.2 음성 답변 플로우

**주요 단계:**

1. **음성 녹음**: AnsweringSection에서 `MediaRecorder` API 등을 사용해 음성 녹음을 시작합니다.
2. **Presigned URL 요청**: 녹음 완료 시, AnswerInput이 `GET /api/answers/upload-url` API를 내부적으로 호출합니다.
3. **직접 업로드**: `AnswerInput`이 발급받은 URL로 NCP Object Storage에 음성 파일을 직접 PUT합니다.
4. **audioUrl 확보**: `AnswerInput`이 업로드된 파일의 `audioUrl`(또는 Key)을 확보합니다.
5. **자동 답변 제출**: `AnswerInput`이 `POST /api/answer`s API를 `audioUrl`과 함께 자동으로 호출합니다.
6. **피드백 ID 수신**: `AnswerInput`이 POST 응답으로 feedbackId를 수신합니다.
7. **onAnswerComplete 콜백**: AnswerInput이 부모의 onAnswerComplete 함수를 feedbackId와 함께 호출합니다.
8. **상태 저장**: AnsweringSection은 handleAnswerComplete 함수에서 submittedFeedbackId를 state에 저장합니다.
9. **피드백 페이지 이동**: 클라이언트가 `/api/answers/{id}`로 최종 답변과 피드백을 조회합니다.

---

### 5.3 텍스트 답변 플로우

텍스트 답변은 더 단순한 동기 플로우를 따릅니다.

**주요 단계:**

1. **텍스트 입력**: 사용자가 브라우저에서 텍스트로 답변을 입력합니다.
2. **답변 등록**: `POST /api/answers` API를 호출하여 answerText와 questionId를 서버에 전송합니다.
3. **SSE 연결**: POST 성공 시, UI를 '피드백 생성 중'으로 변경하고 `GET /api/sse/connect`에 연결합니다.
4. **AI 피드백 생성**: `FeedbackService`가 OpenAI GPT API를 호출하여 피드백을 생성합니다. 이 과정은 비동기로 처리됩니다.
5. **실시간 이벤트 수신**: feedback_ready SSE 이벤트를 수신할 때까지 대기합니다.
6. **결과 조회**: feedback_ready 이벤트 수신 후, `GET /api/answers/{id}` API로 피드백을 조회합니다.

**음성 답변과의 차이점:**
- STT 단계가 없어 더 빠른 처리
- Answer 생성 시점에 이미 텍스트가 포함됨
- 피드백 생성만 비동기로 처리

---

### 5.4 꼬리 질문 생성 플로우

사용자의 답변을 바탕으로 AI가 추가 질문을 생성하여 실제 면접과 유사한 경험을 제공합니다.

**주요 단계:**

1. **꼬리 질문 생성 요청**: '꼬리 질문 받기' 버튼 클릭 시 `POST /api/questions/followUp/{answerId}` API를 호출합니다.
2. **생성 완료 처리**: API 호출 성공 시, 사용자에게 '꼬리 질문 생성 완료' 알림(Toast)을 표시합니다.

**꼬리 질문의 특징:**
- 사용자의 답변 내용을 바탕으로 맥락에 맞는 추가 질문 생성
- 실제 면접에서 면접관이 할 수 있는 심화 질문 시뮬레이션
- 답변의 깊이와 완성도를 높이는 데 도움

---

### 5.5 상태 조회 플로우

클라이언트는 주기적으로 또는 SSE 이벤트 수신 후 상태를 확인할 수 있습니다.

**주요 단계:**

1. **상태 폴링(Polling)**: SSE 연결 실패 시, `GET /api/answers/{id}/status` API를 setInterval로 주기적 호출합니다.
2. **상태 확인**: 응답받은 sttStatus, feedbackStatus 값에 따라 UI 상태를 동기화합니다.
3. **폴링 중지 및 결과 조회**: feedbackStatus가 DONE이 되면 폴링을 중지하고 `GET /api/answers/{answerId}`로 최종 결과를 조회합니다.

---

## 6. 핵심 이슈
<details>
  <summary>STT 비동기 처리: FFMPEG, Pre-Signed URL, SSE</summary>
    
### 문제점
  1. 데이터 표준화 필요: 브라우저 녹음(.WebM) 포맷은 STT 서비스 인식률 불안정. STT 엔진이 안정적으로 인식하는 PCM .WAV 포맷으로 변환 필요.
  2. 서버 부하: FE → BE → 스토리지로 음성 파일을 중계하는 방식은 서버 트래픽 부하 유발.
  3. 비효율적 상태 조회: STT 비동기 처리 완료 여부를 알기 위해 주기적 폴링(Polling) 사용. 비효율적 UX 및 서버 자원 낭비 발생.

### 해결방안
  1. 클라이언트 표준화 (FFMPEG): FFMPEG.js 라이브러리 도입. 업로드 직전 브라우저 단에서 .WebM을 .WAV로 직접 변환.
  2. 직접 업로드 (Pre-Signed URL): BE에 임시 URL(Pre-Signed URL)을 요청. FE가 스토리지로 음성 파일을 직접 업로드하여 서버 중계 부하 제거.
  3. 실시간 수신 (SSE): 업로드 후 FE가 EventSource로 SSE 연결 수립. BE가 STT/피드백 완료 시점에 FE로 이벤트(stt_completed 등)를 실시간 푸시.

### 기대 효과 및 검증
- STT 엔진에 최적화된 .WAV 포맷 제공으로 인식률 및 안정성 향상.
- FE의 스토리지 직접 업로드로 서버 트래픽 부하 제거.
- 불필요한 폴링 제거. SSE로 실시간 이벤트를 수신하여 신속한 사용자 경험 제공.

</details>

<details>
    <summary>Cursor 기반 무한 스크롤: Intersection Observer + Cursor API</summary>

### 도입배경
  1. 사용자에게 끊김 없는 콘텐츠 탐색 경험을 제공하기 위해 페이지네이션 방식이 아닌 무한 스크롤 방식 도입.
  2. 대규모 데이터 환경에서 발생할 수 있는 FE/BE 성능 이슈 사전 방지 > `Intersection Observer`와 `Cursor` 기반 페이지네이션 결합.

### 문제점
  1. FE 성능 저하
     - `scroll` 이벤트 리스너 사용 시, 스크롤할 때마다 불필요한 이벤트가 과도하게 발생하여 메인 스레드 부하 및 브라우저 렌더링 성능 저하 유발.
  3. BE 성능 저하 및 데이터 정합성 문제
     - 전통적인 오프셋(`Offset`) 기반 페이지네이션(`page=N`, `limit=M`)은 페이지 번호가 커질수록 `DB`의 스캔 범위가 넓어져 쿼리 성능 저하(`Offset` 비효율 문제).
     - 데이터 조회 중 실시간으로 데이터가 추가/삭제될 경우 중복되거나 누락된 데이터가 노출될 위험 존재.
     
### 해결방안
  1. 최적화된 데이터 로딩 시점 감지 (FE)
     -  기술: `Intersection Observer API`.
     -  구현: 리스트의 마지막 요소(`Sentinel`)를 관찰 대상으로 설정, 해당 요소가 뷰포트(`Viewport`)에 교차하는 순간을 비동기적으로 감지하여 다음 데이터 요청 트리거.
     -  효과: 메인 스레드 부하를 최소화하고 부드러운 스크롤 경험 보장.
       
  2. 효율적이고 정확한 데이터 페이지네이션 (BE/FE)
     - 기술: `Cursor` 기반 페이지네이션 (`Cursor-based Pagination`)
     - 구현
         - 페이지 번호 대신, 마지막으로 로드된 아이템의 고유 식별자(ID, 생성일시 등)를 커서(`Cursor`)로 활용.
         - 클라이언트는 다음 요청 시 이 커서를 서버에 전달하고, 서버는 해당 커서 다음 위치의 데이터를 조회.
     - 효과
         - 성능 향상: `DB` 인덱스를 활용한 효율적인 범위 검색이 가능하여, 데이터 규모와 관계없이 일정한 조회 성능 유지.
         - 데이터 정합성 보장: 실시간 데이터 변경에도 중복이나 누락 없는 안정적인 데이터 스트림 제공.

### 기대효과
- 사용자 경험(UX) 향상: 끊김 없고 부드러운 무한 스크롤 경험 제공.
- 클라이언트 성능 최적화: 불필요한 연산 제거로 브라우저 리소스 효율성 증대.
- 서버 확장성 확보: 대용량 데이터 환경에서도 안정적인 API 성능 유지.

</details>
  
## 7. 기술 스택

### 7.0 전체 아키텍처

<img width="6513" height="2075" alt="배굥" src="https://github.com/user-attachments/assets/77097b0c-b8a7-4465-b3ea-97ad55bbb62d" />


**주요 컴포넌트:**
- **클라이언트**: Vite React 기반 웹앱 또는 Chrome Extension
- **Spring Boot 서버**: 비즈니스 로직 처리 및 API 제공
- **NCP Object Storage**: 음성 파일 저장소
- **NCP CLOVA STT**: 음성을 텍스트로 변환
- **OpenAI GPT**: 답변에 대한 AI 피드백 생성
- **MySQL**: Answer, Feedback, Question 등 데이터 영구 저장

---

### 7.1 프론트엔드

| React 19.0.0 | TypeScript 5.4.5 | Vite 5.2.0 | npm 10.2.4 | MSW 2.2.14 | Vercel |
|:---------:|:----------:|:-------------:|:---------------:|:------------:|:----------------:|

<img width="381" height="419" alt="image" src="https://github.com/user-attachments/assets/b8248468-bdf1-48f4-9ccb-6c5080b77b24" />


- UI 프레임워크 : React 19.1.1
- 언어 : TypeScript 5.4.5
- 빌드 도구 : Vite 5.2.0
- 패키지 매니저 : npm 10.2.4 (Node.js 20.11.0 권장)
- 확장 프로그램: Chrome Extension, PWA (Progressive Web App)
- 상태 관리 : React Hooks & Context API
- 라우팅 : React Router 6.22.3
- 스타일링 : Emotion 11.11.0
- HTTP 클라이언트 : Axios 1.6.8
- API 모킹 : MSW 2.11.3 (Mock Service Worker)
- 인증 : JWT (localStorage 기반), Kakao SDK
- 스키마 유효성 검사 : Zod 4.1.11
- 아이콘 라이브러리 : Lucide React 0.364.0
- 애니메이션 : Lottie React 2.4.0
- 배포 : Vercel
- 코드 품질 : ESLint 8.57.0, Prettier 3.2.5

### 7.2 백엔드
- **언어**: Java 21
- **데이터베이스**: MySQL 8.0 (InnoDB)

### 7.3 인프라
- **컨테이너화**: Docker, Docker Compose
- **이미지 빌드**: Jib
- **CI/CD**: GitHub Actions
- **배포**: SSH 기반 자동 배포

---

## 8. 프로젝트 구조

```
TEAMS_FE/
├─ .github/              # GitHub 저장소 설정 (이슈, PR 템플릿, 워크플로우)
│  ├─ ISSUE_TEMPLATE/    # 이슈 생성 템플릿
│  ├─ workflows/         # GitHub Actions 워크플로우 (CI/CD)
│  │  └─ ci.yml          # CI (지속적 통합) 설정 파일
│  └─ PULL_REQUEST_TEMPLATE... # PR(Pull Request) 생성 템플릿
├─ .vscode/              # VSCode 편집기 전용 설정
├─ dist/                 # Vite 빌드 결과물이 생성되는 폴더 (배포용)
├─ node_modules/         # 설치된 Node.js 패키지 (라이브러리)
├─ public/               # 정적 파일 폴더 (빌드 시 dist로 복사됨)
│  └─ mockServiceWorker.js # MSW (Mock Service Worker) 실행 파일
├─ src/                  # 핵심 소스 코드 폴더
│  ├─ api/               # 백엔드 API 호출 관련 로직 (Axios 인스턴스 등)
│  ├─ assets/            # 이미지, 폰트 등 정적 리소스
│  ├─ config/            # 앱 전역 설정 (환경 변수 등)
│  ├─ mock/              # MSW API 모킹(Mocking) 핸들러 정의
│  ├─ pages/             # 라우트(페이지) 단위 컴포넌트
│  ├─ routes/            # 라우팅 설정 (React Router)
│  ├─ shared/            # 공통 사용 컴포넌트, 커스텀 훅, 유틸리티 함수
│  ├─ styles/            # 전역 스타일 (CSS, Emotion 등)
│  ├─ App.tsx            # 최상위 메인 애플리케이션 컴포넌트
│  ├─ main.tsx           # React 앱 진입점 (DOM 렌더링 시작)
│  └─ vite-env.d.ts      # Vite 환경 변수 타입 선언
├─ .env.local            # 로컬 개발 환경용 환경 변수 파일
├─ package-lock.json     # 설치된 패키지의 정확한 버전 잠금 파일
├─ package.json          # 프로젝트 정보 및 의존성 패키지 관리
├─ tsconfig.app.json     # TypeScript 설정 (애플리케이션 소스코드용)
├─ tsconfig.json         # TypeScript 전역 설정
├─ tsconfig.node.json    # TypeScript 설정 (Vite 설정 등 Node.js 환경용)
├─ vercel.json           # Vercel 배포 플랫폼 설정
└─ vite.config.ts        # Vite 설정 파일
```

### E-R 다이어그램
<img width="1130" height="671" alt="스크린샷 2025-11-07 오전 1 37 05" src="https://github.com/user-attachments/assets/3bc8b40f-737b-4b03-adc2-a8a1d646fac5" />

---

## 9. 개발 환경 설정

### 필수 요구사항
- Node.js 20.19.0 이상 
- npm 10.2.4 이상
- React 19.1.1 이상
- TypeScript 5.4.5 이상
- Vite 5.2.0 이상

---

## 10. 기대 효과

- **사용자**: 매일 꾸준한 연습 → 성장 체감 → 동기 유지 → 취업 성공 확률↑
- **운영자**: 데이터 축적(답변/난이도/자소서) → AI 학습 자원 확보 → 서비스 고도화
- **시장 경쟁력**: 기존 모의면접 대비 가볍고, 메일 기반 대비 강제성이 있는 '데일리 루틴' 차별화

---

## 11. 추후 로드맵

- **멀티모달 피드백**
    - 현재는 텍스트 위주의 피드백 → **톤 분석**까지 확장
    - 음성 데이터를 기반으로 **태도·목소리 안정성**까지 분석
- **자소서 기반 맞춤 질문 생성**
    - 사용자 자소서 업로드 → N개 핵심 문장 추출 → 직군/기업 컨텍스트로 질문 생성
