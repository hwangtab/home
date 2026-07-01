# Gemini 프로젝트 컨텍스트: 황경하 포트폴리오 웹사이트

## 1. 프로젝트 개요

- **프로젝트명**: 황경하 공식 포트폴리오 웹사이트
- **목표**: 음악, 시각, 공연, 저술, 소식을 한국어/영어로 소개하는 데이터 기반 공식 웹사이트
- **현재 구조**: Next.js App Router 기반 정적 생성 사이트
- **핵심 원칙**: `src/data/siteData.json`을 단일 콘텐츠 원천으로 두고, selector와 번역 검증으로 페이지 데이터를 파생한다.

## 2. 기술 스택

- **프레임워크**: Next.js 16 App Router
- **UI**: React 19, TypeScript, Tailwind CSS
- **애니메이션**: Framer Motion
- **검색**: Fuse.js
- **미디어**: React Player, Next Image
- **검증**: `tsx` 기반 데이터/번역/불변조건 스크립트, ESLint, TypeScript

## 3. 프로젝트 구조

- `src/app/(ko)`, `src/app/(en)`: 한국어/영어 라우트 그룹, layout, metadata, error, not-found
- `src/views`: Home, About, Works, News, Contact 클라이언트 뷰
- `src/components`: 레이아웃, 카드, 검색, 음악 플레이어, 폼, UI primitive
- `src/data/siteData.json`: 공식 콘텐츠 원천
- `src/data/siteContent.ts`: 정규화 및 locale별 selector
- `src/utils/translateSiteData.ts`: 영어 site data 변환 맵
- `src/lib`: SEO와 작품 조회용 server-safe helper
- `scripts`: 운영 검증 스크립트

## 4. 주요 명령

- `npm run dev`: 개발 서버 실행
- `npm start`: 빌드 후 프로덕션 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint 실행
- `npx tsc --noEmit`: 타입 체크
- `npm test`: 문서, 데이터, 번역, 불변조건 검증
- `npm run test:browser`: 빌드 후 브라우저 smoke 검증

## 5. 작업 원칙

- 라우팅과 metadata는 App Router 계층을 기준으로 판단한다.
- 콘텐츠 변경은 `siteData.json`과 번역 맵을 함께 검증한다.
- 한국어/영어 작품 ID, sitemap URL, 이미지 fallback, remote image host allowlist를 깨지 않는다.
- 정합화 작업은 오래된 문서나 이름이 현재 구조를 오해하게 만드는 지점부터 고친다.
- 완료 전 `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`를 확인한다.
