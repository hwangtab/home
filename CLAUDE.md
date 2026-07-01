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
