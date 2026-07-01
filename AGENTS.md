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
