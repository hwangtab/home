# 황경하 포트폴리오 웹사이트 리팩토링 로드맵

## 현재 기준

이 저장소의 공식 구조는 Next.js App Router 기반이다. 한국어와 영어 라우트는 `src/app/(ko)`와 `src/app/(en)`에 있으며, 페이지 화면 조립은 `src/views`의 클라이언트 컴포넌트가 담당한다. 콘텐츠 원천은 `src/data/siteData.json` 하나이며, `src/data/siteContent.ts`와 `src/utils/translateSiteData.ts`가 정규화와 영어 파생 데이터를 맡는다.

## 운영 목표

1. 현재 공개 동작과 정적 생성 경로를 보존한다.
2. 문서, 검증 스크립트, 실제 코드 구조가 같은 아키텍처를 설명하게 한다.
3. 콘텐츠 수정자가 `siteData.json`과 번역 맵, 검증 명령만 보고 안전하게 작업할 수 있게 한다.
4. 한국어/영어 작품 ID, sitemap, 이미지 fallback, remote image host allowlist 불변조건을 유지한다.
5. 큰 컴포넌트 분할은 실제 혼란이나 중복을 줄이는 경우에만 수행한다.

## 현재 검증 축

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

`npm test`는 문서 정합성, site data 구조, 번역 커버리지, 프로젝트 불변조건을 확인한다.

## 리팩토링 우선순위

### 1. 문서와 검증 정합화

- `AGENTS.md`, `CLAUDE.md`, `gemini.md`, `QWEN.md`, `README.md`가 현재 App Router 구조를 말하게 유지한다.
- 오래된 클라이언트 전용 앱, 별도 라우터, 예전 페이지 디렉터리, 예전 루트 파일, 제거된 배포 스크립트 설명을 다시 추가하지 않는다.
- `scripts/check-docs-alignment.ts`로 primary guidance 문서의 stale architecture 회귀를 막는다.

### 2. 데이터 계층 안정화

- `siteData.json`을 계속 단일 원천으로 둔다.
- `siteContent.ts` selector와 `translateSiteData.ts` 번역 맵을 통해 locale별 데이터를 파생한다.
- 새 콘텐츠가 들어오면 `npm test`로 ID parity, 한국어 누수, sitemap, 이미지 경로를 확인한다.

### 3. 화면 계층 경계 정리

- `src/app`은 라우트, layout, metadata, error, not-found, sitemap, robots를 담당한다.
- `src/views`는 페이지별 클라이언트 화면 조립을 담당한다.
- `src/components`는 재사용 가능한 카드, 검색, 미디어, 폼, UI primitive를 담당한다.
- 큰 컴포넌트를 나눌 때는 독립적인 소비자와 검증 방법이 있는 경우에만 진행한다.

### 4. 런타임 확인

- 라우트, layout, navigation, not-found, responsive UI를 건드린 변경은 브라우저 smoke 또는 대표 ko/en 페이지 런타임 확인을 추가한다.
- 단순 문서 변경은 diff와 문서 검증으로 충분하지만, package script나 validation 변경은 `npm test`를 실행한다.

## 완료 정의

- primary guidance 문서가 현재 구조와 명령을 정확히 설명한다.
- 오래된 클라이언트 전용 앱과 별도 라우터 지시가 정합화 대상 문서에서 사라진다.
- 문서 정합성 검증이 `npm test`에 포함된다.
- 기존 데이터, 번역, invariant, lint, typecheck, build 검증이 통과한다.
