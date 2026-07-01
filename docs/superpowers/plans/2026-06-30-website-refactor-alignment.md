# Website Refactor Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the website repository around its current Next.js App Router architecture, canonical site data model, and validation workflow.

**Architecture:** This pass preserves the current hybrid architecture: thin App Router route files own URL, layout, metadata, sitemap, robots, and static generation, while `src/views` keeps client-side page composition. Documentation and validation will make that architecture explicit, and source code changes will be limited to alignment checks and small boundary clarifications.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS, Framer Motion, `tsx` validation scripts, Node.js assertion APIs.

## Global Constraints

- Preserve current public behavior and static generation shape.
- Keep `src/data/siteData.json` as the single content source of truth.
- Keep Korean/English work IDs, sitemap entries, and translated site data in lockstep.
- Do not migrate the app back to Create React App or React Router.
- Do not perform a broad visual redesign in this pass.
- Do not replace the current locale routing scheme.
- Do not weaken data, translation, sitemap, asset, or image-host validation.
- Avoid client-side pathname tricks for 404/localization changes that would disturb the static App Router posture.
- Minimum final verification: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.

---

## File Structure

- Modify `AGENTS.md`: repository-local operating guide for coding agents, including the user judgment principles and current Next.js architecture.
- Modify `CLAUDE.md`: current Claude Code guidance; remove stale CRA, React Router, and gh-pages guidance.
- Modify `gemini.md`: current Gemini context; remove stale SPA, react-scripts, and future TypeScript migration claims.
- Modify `QWEN.md`: keep the detailed project context, but correct stale deployment/output and command statements.
- Modify `README.md`: concise human-facing overview, commands, data rules, and verification gates.
- Create `scripts/check-docs-alignment.ts`: validates that primary guidance files do not reintroduce stale architecture claims.
- Modify `package.json`: add `docs:validate` and include it in `npm test`.
- Replace `docs/refactoring-plan.md`: turn the stale aspirational plan into the current alignment roadmap.
- Replace `docs/typescript-migration.md`: mark the old migration plan as a historical record and summarize current TypeScript status.

No production route, view, component, data, or style file should change unless implementation discovers a concrete mismatch that cannot be fixed by documentation and validation.

---

### Task 1: Align Primary Guidance Docs

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `gemini.md`
- Modify: `QWEN.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: current `package.json` scripts and current file tree under `src/app`, `src/views`, `src/data`, `src/components`, `scripts`.
- Produces: primary guidance files that describe the same current architecture and commands.

- [ ] **Step 1: Capture the stale guidance baseline**

Run:

```bash
rg -n "Create React App|React Router|react-scripts|src/pages|src/App\\.(js|tsx)|gh-pages|predeploy|React 18\\.2|SPA|build/" AGENTS.md CLAUDE.md gemini.md README.md QWEN.md
```

Expected: matches in `AGENTS.md`, `CLAUDE.md`, `gemini.md`, and possibly `QWEN.md`. These are the stale claims this task removes.

- [ ] **Step 2: Replace `AGENTS.md` with current agent guidance**

Use this content:

```markdown
# AGENTS.md

This file provides guidance for agentic coding agents operating in this repository.

## 판단 원칙: 의도 우선, 국소 해법 금지

에이전트는 사용자의 요청을 문자 그대로만 구현하지 말고, 운영 의도와 제품 불변조건을 먼저 추론해야 한다.

1. "기술적으로 가능"한 우회가 아니라, 운영자가 실제로 원하는 최종 경험을 기준으로 설계한다.
2. 국소적인 패치가 근본 요구사항을 흐릴 수 있으면 즉시 지적한다.
3. 기본값과 fallback도 운영 의도와 같아야 한다.
4. 환경변수가 없을 때만 좋은 동작을 하고 운영 env에서는 나쁜 값이 유지되는 설계는 실패로 본다.
5. 사용자가 화난 부분은 단순 감정이 아니라 요구사항 발견 신호로 본다.

구현 전 자체 질문:

- 이 변경은 사용자가 기대하는 최종 경험을 직접 만족하는가?
- 내가 지금 헤더/설정/예외로 우회하고 있지는 않은가?
- 기본값, fallback, 운영 env, 테스트 env가 모두 같은 제품 의도를 따르는가?
- 사용자가 한 달 뒤 이 기능을 운영할 때 덜 헷갈리는 구조인가?

## Project Overview

Official Korean/English portfolio website for musician 황경하 (Hwang Gyeongha). The app uses Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, and centralized JSON-backed content.

## Architecture

- `src/app/(ko)` and `src/app/(en)`: route groups, layouts, metadata, error and not-found entry points.
- `src/views`: client page composition for Home, About, Works, News, and Contact.
- `src/components`: reusable layout, cards, media, form, page section, and UI primitives.
- `src/data/siteData.json`: canonical content source for artist profile, works, events, and news.
- `src/data/siteContent.ts`: normalized and localized selectors derived from site data.
- `src/utils/translateSiteData.ts`: Korean-to-English site data translation map.
- `src/lib`: server-safe helpers for SEO and work lookup.
- `scripts`: data, translation, invariant, prerender, and browser smoke validation.

## Commands

- `npm run dev` - Start the Next.js development server.
- `npm start` - Start the production server after `npm run build`.
- `npm run build` - Build the production Next.js app.
- `npm run lint` - Run ESLint.
- `npm run data:validate` - Validate `src/data/siteData.json`.
- `npm run data:translations` - Validate locale key parity and translated site data.
- `npm test` - Run documentation, data, translation, and invariant checks.
- `npm run test:prerender` - Check prerendered output.
- `npm run test:browser` - Build and run browser smoke checks.
- `npx tsc --noEmit` - Run TypeScript type checking.

## Data Rules

- Treat `src/data/siteData.json` as the single source of truth.
- Keep work IDs URL-safe, unique, and identical across Korean and English derived data.
- Keep `archiveCategory` aligned with the containing work category.
- Add English mappings in `src/utils/translateSiteData.ts` whenever Korean site data changes.
- Allow remote cover hosts in `next.config.mjs` before using them in content.

## Implementation Guidance

- Preserve the App Router static build posture unless a task explicitly changes routing.
- Prefer server-safe helpers in `src/lib` for metadata, sitemap, and work lookup.
- Keep interactive animated page assembly in client views or client components.
- Do not introduce a second content source for works, news, events, artist profile, routes, or locale slugs.
- Before handoff, run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
```

- [ ] **Step 3: Replace `CLAUDE.md` with current Claude guidance**

Use this content:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

This is the official Korean/English portfolio website for musician, producer, and sound engineer 황경하 (Hwang Gyeongha). The current runtime is Next.js App Router with static generation, localized route groups, centralized content data, and client-side animated view composition.

## Architecture

- `src/app/(ko)` and `src/app/(en)`: route groups, layouts, metadata, error and not-found entry points.
- `src/views`: client page composition for Home, About, Works, News, and Contact.
- `src/components`: reusable layout, cards, media, form, page section, and UI primitives.
- `src/data/siteData.json`: canonical content source for artist profile, works, events, and news.
- `src/data/siteContent.ts`: normalized and localized selectors derived from site data.
- `src/utils/translateSiteData.ts`: Korean-to-English site data translation map.
- `src/lib`: server-safe helpers for SEO and work lookup.
- `scripts`: data, translation, invariant, prerender, and browser smoke validation.

## Commands

- `npm run dev` - Start the Next.js development server.
- `npm start` - Start the production server after `npm run build`.
- `npm run build` - Build the production Next.js app.
- `npm run lint` - Run ESLint.
- `npm run data:validate` - Validate `src/data/siteData.json`.
- `npm run data:translations` - Validate locale key parity and translated site data.
- `npm test` - Run documentation, data, translation, and invariant checks.
- `npm run test:prerender` - Check prerendered output.
- `npm run test:browser` - Build and run browser smoke checks.
- `npx tsc --noEmit` - Run TypeScript type checking.

## Data Rules

- Treat `src/data/siteData.json` as the single source of truth.
- Keep work IDs URL-safe, unique, and identical across Korean and English derived data.
- Keep `archiveCategory` aligned with the containing work category.
- Add English mappings in `src/utils/translateSiteData.ts` whenever Korean site data changes.
- Allow remote cover hosts in `next.config.mjs` before using them in content.

## Implementation Guidance

- Preserve the App Router static build posture unless a task explicitly changes routing.
- Prefer server-safe helpers in `src/lib` for metadata, sitemap, and work lookup.
- Keep interactive animated page assembly in client views or client components.
- Do not introduce a second content source for works, news, events, artist profile, routes, or locale slugs.
- Before handoff, run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
```

- [ ] **Step 4: Replace `gemini.md` with current Gemini context**

Use this content:

```markdown
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
```

- [ ] **Step 5: Update `QWEN.md` in place**

Apply these exact replacements:

```text
Replace "GitHub Pages / Vercel 배포" with "Vercel/Next.js 정적 생성 배포".
Replace "next build → build/" with "next build".
Replace "`npm run build` | 프로덕션 빌드 → `build/`" with "`npm run build` | 프로덕션 Next.js 빌드".
Replace "React 18" mentions with "React 19".
Remove any line that presents GitHub Pages deploy as an npm script.
```

Then add this line under the command table:

```markdown
| `npm test` | 문서/데이터/번역/불변조건 검증 |
```

- [ ] **Step 6: Replace `README.md` with a concise current overview**

Use this content:

```markdown
# Hwang Gyeongha Official Web

Official Korean/English portfolio website for musician Hwang Gyeongha. The app uses Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, and centralized site data.

## Commands

- `npm run dev` - Start the development server.
- `npm start` - Start the production server after `npm run build`.
- `npm run build` - Build the production Next.js app.
- `npm run lint` - Run ESLint.
- `npx tsc --noEmit` - Run TypeScript type checking.
- `npm run data:validate` - Validate `src/data/siteData.json`.
- `npm run data:translations` - Validate locale parity and Korean-to-English site data coverage.
- `npm test` - Run documentation, data, translation, and invariant checks.
- `npm run test:browser` - Build and run browser smoke checks.

## Architecture

- `src/app/(ko)` and `src/app/(en)` provide localized App Router routes, layouts, metadata, error pages, and static generation.
- `src/views` contains client page composition for Home, About, Works, News, and Contact.
- `src/components` contains reusable UI, layout, media, cards, and form components.
- `src/data/siteData.json` is the canonical content source.
- `src/data/siteContent.ts` and `src/utils/translateSiteData.ts` derive normalized localized data.
- `scripts` contains operational validation for content, translations, invariants, prerendering, and browser smoke.

## Data Rules

When editing content, keep these invariants true:

- Work IDs are unique URL-safe slugs.
- Korean and English generated work IDs stay identical.
- External image hosts used by work covers are allowed in `next.config.mjs`.
- Local image paths exist under `public/`.
- `archiveCategory` matches the containing work category.
- Translation mappings in `src/utils/translateSiteData.ts` cover all Korean strings in site data.

## Verification

Before deployment or handoff, run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```
```

- [ ] **Step 7: Verify stale terms are removed from primary guidance**

Run:

```bash
rg -n "Create React App|React Router|react-scripts|src/pages|src/App\\.(js|tsx)|gh-pages|predeploy|React 18\\.2|SPA|build/" AGENTS.md CLAUDE.md gemini.md README.md QWEN.md
```

Expected: no output.

- [ ] **Step 8: Commit primary guidance alignment**

Run:

```bash
git add AGENTS.md CLAUDE.md gemini.md QWEN.md README.md
git commit -m "docs: align primary project guidance"
```

Expected: commit succeeds.

---

### Task 2: Add Documentation Alignment Validation

**Files:**
- Create: `scripts/check-docs-alignment.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: primary guidance files from Task 1.
- Produces: `npm run docs:validate`, and makes `npm test` enforce documentation alignment.

- [ ] **Step 1: Create `scripts/check-docs-alignment.ts`**

Use this content:

```ts
#!/usr/bin/env tsx

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const primaryGuidanceFiles = ['AGENTS.md', 'CLAUDE.md', 'gemini.md', 'README.md', 'QWEN.md'] as const;

const forbiddenPatterns: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bCreate React App\b/i, reason: 'The current app is Next.js App Router.' },
  { pattern: /\bReact Router\b/i, reason: 'Routing is owned by Next.js App Router.' },
  { pattern: /\breact-scripts\b/i, reason: 'The project does not use react-scripts.' },
  { pattern: /\bsrc\/pages\b/i, reason: 'Current route entries live under src/app.' },
  { pattern: /\bsrc\/App\.(js|tsx)\b/i, reason: 'There is no App root file in the current runtime.' },
  { pattern: /\bgh-pages\b/i, reason: 'Package scripts do not deploy through gh-pages.' },
  { pattern: /\bpredeploy\b/i, reason: 'Package scripts do not define predeploy.' },
  { pattern: /\bReact 18\.2\b/i, reason: 'package.json uses React 19.' },
  { pattern: /\bSPA\b/i, reason: 'Do not describe the current App Router site as an SPA.' },
  { pattern: /\bbuild\/\b/i, reason: 'Do not describe Next.js build output as build/.' }
];

const requiredPhrasesByFile: Record<string, string[]> = {
  'AGENTS.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'CLAUDE.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'gemini.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'README.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'src/data/siteData.json', 'npm test'],
  'QWEN.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'siteData.json', 'npm test']
};

const read = (file: string): string => readFileSync(file, 'utf8');

for (const file of primaryGuidanceFiles) {
  const content = read(file);

  for (const { pattern, reason } of forbiddenPatterns) {
    assert.ok(!pattern.test(content), `${file} contains stale guidance matching ${pattern}: ${reason}`);
  }

  for (const phrase of requiredPhrasesByFile[file]) {
    assert.ok(content.includes(phrase), `${file} must mention current architecture phrase: ${phrase}`);
  }
}

console.log(`Documentation alignment checked: ${primaryGuidanceFiles.length} primary guidance files.`);
```

- [ ] **Step 2: Add package scripts**

In `package.json`, change the scripts block so it contains:

```json
"docs:validate": "tsx scripts/check-docs-alignment.ts",
"test": "npm run docs:validate && npm run data:validate && npm run data:translations && tsx scripts/test-invariants.ts"
```

Keep all existing scripts that are not shown here.

- [ ] **Step 3: Run the new docs validator**

Run:

```bash
npm run docs:validate
```

Expected output includes:

```text
Documentation alignment checked: 5 primary guidance files.
```

- [ ] **Step 4: Run the full test command**

Run:

```bash
npm test
```

Expected output includes:

```text
Documentation alignment checked: 5 primary guidance files.
siteData validation passed.
Locale keys checked:
Translated siteData integrity checked:
Invariant tests passed:
```

- [ ] **Step 5: Commit validation tooling**

Run:

```bash
git add package.json scripts/check-docs-alignment.ts
git commit -m "test: enforce documentation architecture alignment"
```

Expected: commit succeeds.

---

### Task 3: Replace Stale Refactoring and Migration Docs

**Files:**
- Modify: `docs/refactoring-plan.md`
- Modify: `docs/typescript-migration.md`
- Modify: `scripts/check-docs-alignment.ts`

**Interfaces:**
- Consumes: the architecture vocabulary and docs validator from Tasks 1 and 2.
- Produces: current planning documents that no longer guide future work toward obsolete structures.

- [ ] **Step 1: Replace `docs/refactoring-plan.md`**

Use this content:

```markdown
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
```

- [ ] **Step 2: Replace `docs/typescript-migration.md`**

Use this content:

```markdown
# TypeScript Migration Historical Record

This document is historical. The project is already TypeScript-first for the active Next.js App Router runtime.

## Current Status

- App routes use `.tsx` and `.ts` under `src/app`.
- Client views use `.tsx` under `src/views`.
- Components use `.tsx` under `src/components`.
- Data, hooks, utilities, libraries, and validation scripts use `.ts` where appropriate.
- `npx tsc --noEmit` is part of the required verification gate.

## Current Type Safety Rules

- Use explicit prop and function parameter types.
- Use `interface` for object shapes and `type` for unions or primitives.
- Avoid `any`; prefer `unknown` with type guards when necessary.
- Keep shared domain types in `src/types`.
- Treat imported JSON as runtime data that must be validated by scripts.

## Verification

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Notes

Older migration notes referenced a JavaScript app and an earlier toolchain. Those details are no longer implementation guidance for this repository. Future TypeScript work should improve the current Next.js codebase in place rather than following an old migration sequence.
```

- [ ] **Step 3: Expand `scripts/check-docs-alignment.ts` for the roadmap docs**

Change:

```ts
const primaryGuidanceFiles = ['AGENTS.md', 'CLAUDE.md', 'gemini.md', 'README.md', 'QWEN.md'] as const;
```

to:

```ts
const primaryGuidanceFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'gemini.md',
  'README.md',
  'QWEN.md',
  'docs/refactoring-plan.md'
] as const;
```

Add this entry to `requiredPhrasesByFile`:

```ts
'docs/refactoring-plan.md': ['Next.js App Router', 'src/app/(ko)', 'src/app/(en)', 'src/views', 'siteData.json', 'npm test']
```

Add this check after the primary guidance loop:

```ts
const typescriptMigrationDoc = read('docs/typescript-migration.md');
assert.ok(
  typescriptMigrationDoc.startsWith('# TypeScript Migration Historical Record'),
  'docs/typescript-migration.md must be marked as a historical record.'
);
assert.ok(
  typescriptMigrationDoc.includes('The project is already TypeScript-first'),
  'docs/typescript-migration.md must state the current TypeScript-first status.'
);
```

- [ ] **Step 4: Run docs validation**

Run:

```bash
npm run docs:validate
```

Expected output includes:

```text
Documentation alignment checked: 6 primary guidance files.
```

- [ ] **Step 5: Run stale-term search across aligned docs**

Run:

```bash
rg -n "Create React App|React Router|react-scripts|src/pages|src/App\\.(js|tsx)|gh-pages|predeploy|React 18\\.2|SPA|build/" AGENTS.md CLAUDE.md gemini.md README.md QWEN.md docs/refactoring-plan.md
```

Expected: no output.

- [ ] **Step 6: Commit roadmap doc alignment**

Run:

```bash
git add docs/refactoring-plan.md docs/typescript-migration.md scripts/check-docs-alignment.ts
git commit -m "docs: replace stale refactor roadmap"
```

Expected: commit succeeds.

---

### Task 4: Full Verification and Completion Audit

**Files:**
- Inspect: `AGENTS.md`
- Inspect: `CLAUDE.md`
- Inspect: `gemini.md`
- Inspect: `QWEN.md`
- Inspect: `README.md`
- Inspect: `docs/refactoring-plan.md`
- Inspect: `docs/typescript-migration.md`
- Inspect: `scripts/check-docs-alignment.ts`
- Inspect: `package.json`

**Interfaces:**
- Consumes: completed documentation and validator changes from Tasks 1-3.
- Produces: evidence that the repository is aligned and existing app behavior gates remain green.

- [ ] **Step 1: Check git status**

Run:

```bash
git status --short
```

Expected: no unstaged changes except intentional files from unfinished current task. If there are unrelated files, leave them untouched and report them.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected output includes:

```text
Documentation alignment checked: 6 primary guidance files.
siteData validation passed.
Locale keys checked:
Translated siteData integrity checked:
Invariant tests passed:
```

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: command exits 0.

- [ ] **Step 4: Run typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: command exits 0 with no TypeScript errors.

- [ ] **Step 5: Run production build**

Run:

```bash
npm run build
```

Expected output includes static routes for `/`, `/about`, `/works`, `/news`, `/contact`, `/en`, `/en/about`, `/en/works`, `/en/news`, `/en/contact`, `/robots.txt`, `/sitemap.xml`, and generated work detail paths.

- [ ] **Step 6: Audit acceptance criteria**

Run:

```bash
rg -n "Create React App|React Router|react-scripts|src/pages|src/App\\.(js|tsx)|gh-pages|predeploy|React 18\\.2|SPA|build/" AGENTS.md CLAUDE.md gemini.md README.md QWEN.md docs/refactoring-plan.md
git diff --stat HEAD~3..HEAD
git status --short
```

Expected:

- stale-term search prints no matches.
- diff stat shows only documentation, `package.json`, and `scripts/check-docs-alignment.ts`.
- final git status is clean.

- [ ] **Step 7: Prepare final summary**

Report:

- Design spec path and implementation plan path.
- Commit hashes created during implementation.
- Verification commands and pass/fail results.
- Any intentionally deferred code refactors, especially large component splits.
