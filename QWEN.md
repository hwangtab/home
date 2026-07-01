# QWEN.md — 프로젝트 컨텍스트 가이드

## 프로젝트 개요

**황경하 (Hwang Gyeongha)** — 음악 제작자·예술 기획자의 다국어 포트폴리오 웹사이트.
Next.js App Router 기반, 한국어/영어双语 지원, Tailwind CSS + Framer Motion 애니메이션.

라우트는 `src/app/(ko)`와 `src/app/(en)` route group에서 다국어를 분기하고, 한국어는 `/`, `/about`, `/works`, `/news`, `/contact` 같은 unprefixed 경로를, 영어는 `/en/*` 경로를 사용하며, 페이지 뷰는 `src/views`에서 조합한다.

- **이름:** `hwangtab` (v0.1.0)
- **버킷:** Vercel/Next.js 정적 생성 배포
- **데이터 중심 아키텍처:** `src/data/siteData.json`에 아티스트 이력·작품·공연·뉴스 전량 중앙 관리

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (~16.1.6), App Router, 한국어 unprefixed + 영어 `/en/*`, `src/app/(ko)` / `src/app/(en)` route groups |
| UI | React 19, TypeScript 5.9, Tailwind CSS 3.3 |
| 애니메이션 | Framer Motion 12 |
| 국제화 | `src/i18n/` — `LanguageProvider` + `useLanguage()`, localStorage 기반 언어 선호 저장 |
| 데이터 | `siteData.json` (`metadata`는 `src/data/siteData.json` 기준, 현재 `version 3.5.0`, `lastUpdated 2026-05-21`) |
| 빌드/배포 | Vercel (`vercel.json` 정적 캐시 설정), `next build` |
| 폰트 | Wanted Sans Variable (CDN), HSBombaram3, BookkMyungjo, HSSanTokki20 (Project Noonnu CDN) |

## 프로젝트 구조 (핵심)

```
src/
├── app/                    # Next.js App Router 라우트
│   ├── (ko)/               # 한국어 페이지: /, /about, /works, /news, /contact
│   ├── (en)/               # 영어 페이지: /en/, /en/about, /en/works, /en/news, /en/contact
│   ├── globals.css
│   ├── providers.tsx
│   ├── robots.ts / sitemap.ts
├── components/             # 재사용 UI 컴포넌트
│   ├── cards/              # 작품 카드 계열
│   ├── Layout/             # 네비게이션, 헤더 등 레이아웃
│   ├── ui/                 # 공통 UI primitive
│   ├── effects/            # 애니메이션 효과
│   ├── MusicPlayer.tsx     # 음악 플레이어
│   ├── Lightbox.tsx        # 이미지 라이트박스
│   └── ...
├── views/                 # 페이지 뷰 컴포넌트 (Home, About, Works, News, Contact)
├── data/
│   ├── siteData.json       # 🔑 단일 진실 저장소 — 작품·이력·공연·뉴스 데이터
│   ├── siteContent.ts      # 페이지별 콘텐츠 렌더링 로직
│   └── index.ts
├── i18n/                   # 다국어 번역 + LanguageProvider
├── locales/                # ko.json, en.json 번역 파일
├── hooks/                  # 커스텀 훅 (scroll animation, observer, filter 등)
├── types/                  # TypeScript 타입 정의
├── utils/                  # 유틸리티 함수
├── config/                 # 설정 파일
├── constants/              # 상수
└── context/                # React Context
```

## 빌드 및 실행

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm start` | 프로덕션 서버 시작 |
| `npm run build` | 프로덕션 Next.js 빌드 |
| `npm run lint` | ESLint 실행 |
| `npm run data:validate` | `siteData.json` 데이터 무결성 검증 스크립트 |
| `npx tsc --noEmit` | 타입 체크 |
| `npm test` | 문서/데이터/번역/불변조건 검증 |

## 데이터 관리 핵심 규칙

### `siteData.json` — 단일 진실 저장소

모든 작품(음악/시각/글/공연), 상단, 공연 일정, 뉴스는 `siteData.json`에 중앙 저장됨.
컴포넌트는 이 JSON을 직접 읽거나 `usePageData` 훅을 통해 접근.

**데이터 무결성:**
- `npm run data:validate` — 누락 필드, invalid URL, placeholder 이미지 점검
- metadata.version 및 lastUpdated 필드 추적
- 작품 항목은 `sortPriority`(숫자가 높을수록 우선), `archiveCategory`, `showInPages` 필드 필수

**작품 타입:**
- `music` — 앨범/싱글 (cover, description, primaryAction)
- `visual` — 사진 연작 (images 배열 포함)
- `writing` — 칼럼/르포 (publication, excerpt 포함)
- `performance` — 콘서트/페스티벌/전시

## 다국어 (i18n)

- 라우트: 한국어는 `/`, `/about`, `/works`, `/news`, `/contact` 같은 unprefixed 경로, 영어는 `/en/*` 분리 (`src/app/(ko)`, `src/app/(en)` route group)
- 언어 전환: `LanguageToggle` 컴포넌트 + `useLanguage()` 훅
- 번역 키: `.t('path.to.key')` 형식, 영어 폴백 지원
- 언어 선호: localStorage에 `'language'` 키로 저장

## 스타일 가이드

### Tailwind CSS — 브랜드 컬러 시스템

```
brand.primary    — 파란색 (기본 브랜드)
brand.solidarity — 빨강 (연대/저항, 한복 모티브)
brand.earth      — 흙색 (민중/뿌리)
brand.harmony    — 청록 (희망/화합)
```

- **접근성:** WCAG 2.1 AA 준수 gray 시스템, `prefers-reduced-motion` 지원, `focus-visible:ring-a11y`
- **폰트:** `font-bombaram`, `font-santokki`, `font-wanted-sans` 유틸리티 클래스
- **모바일:** 425px/375px/320px 미디어 쿼리별 컨테이너 패딩 조절, 터치 타겟 44px+

### Framer Motion

```tsx
const variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

<motion.div variants={variants} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
```

- `AnimationContext`로 전역 애니메이션 켜/끄 관리
- 성능 최적화: `transform-gpu`, `will-change`, `contain-strict` 유틸리티 클래스

## ESLint 규칙 (custom)

- `react/display-name`: off (React.FC 사용 시 불필요)
- `react/no-unescaped-entities`: off (한국어 텍스트용)
- `@next/next/no-img-element`: warn (이미지 마이그레이션 진행 중)
- `import/no-anonymous-default-export`: off (라우트 페이지용)
- `react-hooks/set-state-in-effect`: off (스크롤/이벤트 리스너용)

## 코드 작성 시 참고

- **imports:** Named imports 우선, `React.FC<Props>` 타입 사용
- **타입:** `interface`로 객체 타입, `type`으로 union/primitive. `any` 금지
- **에러 처리:** 빈 catch block 금지. ErrorBoundary로 컴포넌트 격리
- **경로 별칭:** `@/*` → `src/*` (tsconfig baseUrl)
- **이미지 CDN:** bugsm, koreanmusicawards, poclanos, melon, youtube 등 `next.config.mjs`에 whitelist

## 메모리 파일 참고

MEMORY.md 참조 — siteData.json 무결성 체크, 코드 리뷰 스타일 컨텍스트 있음.
