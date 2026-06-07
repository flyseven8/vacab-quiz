# vacab-quiz 프로젝트 구조 정리

## 개요

`vacab-quiz`는 Vite 기반 React + TypeScript 단어 퀴즈 앱입니다. Tailwind CSS로 화면을 구성하고, 퀴즈 결과는 브라우저 `localStorage`에 저장합니다.

- 앱 유형: 영어 단어 퀴즈 / 스펠링 타자 게임
- 주요 기술: React 19, TypeScript, Vite, Tailwind CSS
- 배포 방식: `gh-pages`를 통한 GitHub Pages 배포
- 배포 경로: `https://flyseven8.github.io/vacab-quiz/`
- Vite base path: `/vacab-quiz/`

## 디렉터리 구조

```text
vacab-quiz/
├── public/
│   ├── cat.svg
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── QuizResult.tsx
│   │   ├── ResultHistory.tsx
│   │   ├── SpellingTypingGame.tsx
│   │   └── WordMatchingGame.tsx
│   ├── data/
│   │   └── quizData.ts
│   ├── utils/
│   │   └── localStorage.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── dist/
├── node_modules/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── README.md
```

`dist/`와 `node_modules/`는 빌드 산출물 및 의존성 디렉터리입니다. 실제 소스 분석의 중심은 `src/`입니다.

## 실행 스크립트

`package.json`에 정의된 주요 명령은 다음과 같습니다.

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행. `--host --port 3000` 사용 |
| `npm run build` | TypeScript 빌드 후 Vite 프로덕션 빌드 |
| `npm run lint` | ESLint 실행 |
| `npm run preview` | 빌드 결과 미리보기. `--host --port 3000` 사용 |
| `npm run deploy` | `dist/`를 GitHub Pages에 배포 |
| `npm run predeploy` | 배포 전 자동 빌드 |

## 애플리케이션 진입 흐름

### `src/main.tsx`

React 앱의 진입점입니다.

- `createRoot`로 `#root`에 앱을 마운트합니다.
- `StrictMode`로 `App`을 감쌉니다.
- 전역 스타일 `index.css`를 로드합니다.

### `src/App.tsx`

앱의 최상위 화면 전환과 상태를 담당합니다.

주요 상태:

- `selected`: 선택된 단원 또는 결과 화면 상태
- `gameMode`: 일반 퀴즈 또는 스펠링 타자 게임 모드
- `shuffledItems`: 선택된 단어 세트를 무작위로 섞은 배열
- `isDarkMode`: 다크 모드 여부. `localStorage`에 저장

주요 역할:

- 1과, 2과, 3과, 4과, 전체 단어 세트 선택
- 일반 퀴즈와 타자 게임 진입
- 결과 확인 화면 진입
- 다크 모드 토글
- 앱 시작 시 만료된 퀴즈 결과 정리

현재 연결된 화면:

- `QuizResult`: 일반 퀴즈 화면
- `SpellingTypingGame`: 타자 게임 화면
- `ResultHistory`: 저장된 결과 확인 화면

## 데이터 구조

### `src/data/quizData.ts`

단어 퀴즈 데이터를 관리합니다.

`QuizItem` 타입:

```ts
export type QuizItem = {
    korean: string;
    partOfSpeech: string;
    meaning: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect?: boolean;
}
```

데이터 구성:

- `quizResults22`: 전체 80개 단어 데이터
- `quiz22_1`: 1~20번 단어
- `quiz22_2`: 21~40번 단어
- `quiz22_3`: 41~60번 단어
- `quiz22_4`: 61~80번 단어

각 단어는 한국어 뜻, 품사, 영어 정의, 사용자 답변, 정답을 포함합니다.

## 주요 컴포넌트

### `src/components/QuizResult.tsx`

일반 단어 퀴즈 화면입니다.

주요 기능:

- 한국어 뜻과 영어 정의를 보고 정답 입력
- 정답 제출 후 맞음/틀림 표시
- 9개 이상 틀리면 `탈락`, 그 외 `통과` 판정
- 틀린 문제만 다시 풀기
- 100점일 때 축하 화면과 confetti 표시
- 제출 결과를 `localStorage`에 저장
- 제출 후 정답 발음 재생

의존 모듈:

- `QuizItem`
- `saveQuizResult`
- `react-confetti`

### `src/components/SpellingTypingGame.tsx`

캔버스를 사용하는 스펠링 타자 게임입니다.

주요 기능:

- 한국어 힌트가 적힌 블록이 화면 위에서 아래로 내려옴
- 정답 영어 단어를 입력하면 점수 획득
- 콤보, 레벨, 생명 시스템
- 시간 초과 또는 블록이 바닥에 닿으면 생명 감소
- 레벨이 올라갈수록 속도와 생성 간격이 어려워짐
- 게임 오버 후 최종 점수, 최고 콤보, 달성 레벨 표시

주요 내부 타입:

```ts
interface FallingBlock {
    id: number;
    word: string;
    hint: string;
    x: number;
    y: number;
    speed: number;
    isActive: boolean;
    timeLimit: number;
    startTime: number;
}
```

### `src/components/ResultHistory.tsx`

저장된 퀴즈 결과를 보여주는 화면입니다.

주요 기능:

- 저장된 시험 결과 목록 표시
- 날짜, 단원, 정답 수, 전체 문제 수 표시
- 오답 목록 표시
- 개별 결과 삭제
- 전체 결과 삭제

의존 모듈:

- `getQuizResults`
- `deleteQuizResult`
- `deleteAllQuizResults`

### `src/components/WordMatchingGame.tsx`

단어 맞추기 게임 컴포넌트입니다.

주요 기능:

- 한 문제씩 한국어 뜻을 보고 영어 단어 입력
- 정답 확인 후 다음 문제로 이동
- 최종 점수와 정답률 표시

현재 상태:

- 컴포넌트 구현은 존재하지만, `App.tsx`의 화면 전환 흐름에는 연결되어 있지 않습니다.

## 유틸리티

### `src/utils/localStorage.ts`

퀴즈 결과 저장과 삭제를 담당합니다.

주요 타입:

```ts
export type QuizResultHistory = {
    date: string;
    lesson: string;
    correctCount: number;
    total: number;
    wrongList: { korean: string; correct: string; user: string }[];
    retry: boolean;
    timestamp: number;
};
```

주요 함수:

| 함수 | 설명 |
| --- | --- |
| `cleanExpiredQuizResults` | 3일이 지난 퀴즈 결과 자동 삭제 |
| `saveQuizResult` | 새 퀴즈 결과 저장 |
| `getQuizResults` | 저장된 결과 조회. 조회 전 만료 데이터 정리 |
| `deleteQuizResult` | 특정 인덱스의 결과 삭제 |
| `deleteAllQuizResults` | 모든 결과 삭제 |

저장 키:

```text
quizResultsHistory
```

## 스타일링

### `src/index.css`

Tailwind CSS의 기본 레이어를 로드합니다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `tailwind.config.js`

Tailwind 설정입니다.

- `content`: `index.html`, `src/**/*.{js,ts,jsx,tsx}`, `flowbite` 경로 포함
- `darkMode`: `class`
- 별도 theme 확장 없음
- 플러그인 없음

## 빌드 및 설정 파일

### `vite.config.ts`

Vite 설정입니다.

- React 플러그인 사용
- GitHub Pages 배포를 위해 `base: '/vacab-quiz/'` 설정
- 빌드 출력 폴더: `dist`
- assets 폴더: `assets`
- `manualChunks` 비활성화

### TypeScript 설정

- `tsconfig.json`: 공통 TypeScript 설정 진입점
- `tsconfig.app.json`: 앱 코드용 설정
- `tsconfig.node.json`: Node/Vite 설정 파일용 설정

### ESLint 설정

`eslint.config.js`에서 ESLint 9 flat config 기반 설정을 사용합니다.

## 정적 파일

### `public/`

브라우저에서 그대로 제공되는 정적 파일입니다.

- `cat.svg`
- `vite.svg`

### `src/assets/`

번들링 대상 앱 내부 에셋입니다.

- `react.svg`

현재 주요 화면에서는 `cat.svg`, `vite.svg`, `react.svg`가 핵심 로직에 직접 사용되지는 않는 것으로 보입니다.

## 현재 구조상 관찰 사항

- README는 아직 Vite 템플릿 기본 내용에 가깝고, 실제 앱 설명은 반영되어 있지 않습니다.
- `WordMatchingGame.tsx`는 구현되어 있으나 현재 메인 화면에서 접근할 수 없습니다.
- `App.css` 파일은 존재하지만 현재 `App.tsx`에서는 `index.css`만 import합니다.
- 퀴즈 결과는 서버 없이 브라우저 `localStorage`에 저장되며, 3일 후 자동 정리됩니다.
- 일반 퀴즈와 타자 게임은 같은 단어 데이터(`QuizItem[]`)를 공유합니다.
