# Gemini 프로젝트 컨텍스트: 황경하 포트폴리오 웹사이트

## 1. 프로젝트 개요

- **프로젝트명**: 황경하 아티스트 포트폴리오 웹사이트
- **목표**: 작가의 음악, 시각, 공연, 저술 등 다양한 작품을 아카이빙하고 소개하는 데이터 기반의 동적 웹사이트.
- **주요 특징**:
  - React 기반의 싱글 페이지 애플리케이션 (SPA)
  - 다국어 지원 (한국어/영어)
  - Framer Motion을 활용한 풍부한 애니메이션
  - 반응형 디자인
  - GitHub Pages를 통한 자동 배포

## 2. 기술 스택

- **프레임워크**: React 18.2.0
- **라우팅**: React Router DOM
- **스타일링**: Tailwind CSS, PostCSS
- **상태 관리**: React Context API (리팩토링 계획에 명시됨)
- **애니메이션**: Framer Motion
- **핵심 라이브러리**:
  - `Fuse.js`: 퍼지 검색 기능
  - `Photoswipe`: 이미지 라이트박스
  - `React Player`: 음악 및 비디오 재생
  - `EmailJS`: 클라이언트 측 이메일 전송
- **개발/빌드 도구**: `react-scripts` (Create React App)
- **배포**: `gh-pages`를 이용한 GitHub Pages 배포

## 3. 프로젝트 구조

- `src/pages`: `Home`, `About`, `Works`, `Archive`, `News`, `Contact` 등 주요 페이지 컴포넌트 위치.
- `src/components`: 재사용 가능한 UI 컴포넌트. 리팩토링을 통해 `cards`, `timeline`, `media`, `forms` 등으로 세분화될 예정.
- `src/data`: 웹사이트 콘텐츠와 selector 계층을 관리. 현재 `siteData.json` 단일 소스와 `siteContent.ts` selector를 사용.
- `src/hooks`: `useTimelineData`, `useUnifiedActions` 등 재사용 가능한 커스텀 훅.
- `src/i18n`: 다국어 지원을 위한 설정.
- `public`: `index.html`, 이미지, 파비콘 등 정적 에셋.

## 4. 데이터 관리

- 현재 여러 JSON 파일(`works/`, `albums.json` 등)에 데이터가 분산되어 있음.
- **리팩토링 목표**: 완료. 모든 콘텐츠를 `src/data/siteData.json` 하나로 관리하고, 페이지별 데이터는 selector 계층에서 파생한다.
- `useTimelineData` 같은 커스텀 훅을 사용하여 통합된 데이터 소스에서 각 페이지에 필요한 데이터를 필터링하여 제공할 계획.

## 5. 주요 NPM 스크립트

- `npm start`: 개발 서버 실행
- `npm run build`: 프로덕션용으로 앱 빌드
- `npm test`: 테스트 실행
- `npm run deploy`: `gh-pages`를 사용하여 빌드 결과물을 GitHub Pages에 배포 (`predeploy` 스크립트로 `build` 자동 실행)

## 6. 현재 상태 및 진행 계획

- **현재 ���태**: 기능적으로는 구현되어 있으나, 코드 품질, 성능, 유지보수성 개선을 위한 **대규모 리팩토링이 계획 및 진행 중**인 단계.
- **핵심 문서**: `docs/refactoring-plan.md`에 상세한 분석과 6단계 실행 계획이 명시되어 있음.
- **주요 리팩토링 계획**:
  1.  **데이터 일원화**: 완료. 분산된 JSON 데이터를 `siteData.json`으로 통합하고 `siteContent.ts`로 페이지별 selector 제공.
  2.  **컴포넌트 통합**: 중복되는 카드, 폼 등의 컴포넌트를 재사용 가능한 구조로 변경.
  3.  **성능 최적화**: `React.memo`, `useMemo`, 이미지 지연 로딩, 번들 분석 등 적용.
  4.  **품질 개선**: 에러 처리 시스템 도입, 거대 컴포넌트 분할, 공통 훅 시스템 구축.
  5.  **고급 기능**: Context API를 활용한 전역 상태 관리, 동적 SEO 개선.
  6.  **타입 안정성**: TypeScript 점진적 도입 및 테스트 코드 작성.

**결론**: 이 프로젝트는 단순한 기능 추가/수정보다는 `refactoring-plan.md`에 명시된 구조 개선과 코드 품질 향상을 최우선으로 고려하여 작업을 진행해야 합니다.
