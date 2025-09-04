# DailyQ 프로젝트

협업을 위한 React + TypeScript + Vite 프로젝트입니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format

# 포맷팅 검사
npm run format:check

# 미리보기
npm run preview
```

## 📁 프로젝트 구조
```
dailyq/
├── src/
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 앱 진입점
│   └── vite-env.d.ts    # Vite 타입 정의
├── public/               # 정적 파일
├── package.json          # 프로젝트 설정
├── tsconfig.json         # TypeScript 설정
├── vite.config.ts        # Vite 설정
└── eslint.config.js      # ESLint 설정
```

## 🛠️ 개발 가이드

### 코드 스타일
- TypeScript 사용
- ESLint 규칙 준수
- Prettier 포맷팅 규칙 준수
- 함수형 컴포넌트 사용
- Props 인터페이스 정의
- 세미콜론 사용
- 작은따옴표 사용
- 최대 줄 길이: 100자
- 탭 너비: 2칸

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 커밋 메시지 규칙
- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 스타일 변경
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가/수정

## 📝 환경 변수
`.env` 파일을 생성하여 환경 변수를 설정하세요:
```env
VITE_API_URL=your_api_url_here
```

## 🤝 협업 규칙
1. Pull Request를 통한 코드 리뷰
2. 테스트 코드 작성 권장
3. 문서화 필수
4. 정기적인 코드 리뷰 미팅

## 📞 문의
프로젝트 관련 문의사항이 있으시면 팀 리더에게 연락해주세요.
