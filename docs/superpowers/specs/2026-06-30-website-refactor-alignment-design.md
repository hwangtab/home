# Website Refactor and Alignment Design

Date: 2026-06-30

## Purpose

This project is the official Korean/English portfolio website for Hwang Gyeongha. The current runtime is healthy, but the repository still contains guidance and planning documents from older architecture stages. The refactor should make the current product shape easier to operate, maintain, and extend without changing the public website behavior unless a discrepancy is proven.

The first implementation pass will align the repository around the current Next.js App Router architecture, the centralized site data model, and the existing validation spine.

## Current Evidence

- The active app is Next.js App Router, not Create React App.
- Route entry points live under `src/app/(ko)` and `src/app/(en)`.
- Client view composition lives in `src/views`.
- Shared layout, navigation, and locale behavior live under `src/components`, `src/i18n`, and `src/utils/localePath.ts`.
- Primary content lives in `src/data/siteData.json`.
- Locale-specific derived data comes from `src/data/siteContent.ts` and `src/utils/translateSiteData.ts`.
- Existing verification passes with `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Several repository guidance files still describe older React SPA, React Router, `src/pages`, GitHub Pages deploy, and `build/` assumptions.

## Goals

1. Make repository guidance describe the current app truth.
2. Preserve the current public behavior and static generation shape.
3. Keep `src/data/siteData.json` as the single content source of truth.
4. Keep Korean/English work IDs, sitemap entries, and translated site data in lockstep.
5. Clarify the boundary between route files, client views, shared components, data selectors, and validation scripts.
6. Remove or rewrite stale refactoring guidance that now points agents toward non-existent or obsolete structures.
7. Leave the codebase easier to operate one month later, especially for content edits, locale fixes, SEO/static route changes, and validation.

## Non-Goals

- Do not migrate the app back to Create React App or React Router.
- Do not perform a broad visual redesign in this pass.
- Do not replace the current locale routing scheme.
- Do not split every large component purely for size. Split only where it clarifies a current boundary or removes real confusion.
- Do not weaken data, translation, sitemap, asset, or image-host validation.
- Do not use client-side pathname tricks for 404/localization changes that would disturb the static App Router posture.

## Architecture Decision

The official architecture is:

- `src/app`: Next.js App Router route, layout, metadata, sitemap, robots, error, and not-found entry points.
- `src/views`: client page composition for Home, About, Works, News, and Contact.
- `src/components`: reusable layout, page sections, cards, media, forms, and UI primitives.
- `src/data/siteData.json`: canonical content data.
- `src/data/siteContent.ts`: normalized and localized selectors derived from site data.
- `src/utils/translateSiteData.ts`: Korean-to-English site data translation coverage.
- `src/lib`: server-safe helpers for SEO and work lookup.
- `scripts`: operational validation for data, translations, invariants, prerender, and browser smoke.

This preserves the current hybrid shape: thin App Router route files provide static route and metadata surfaces, while client views continue to assemble animated interactive pages.

## Documentation Alignment

The implementation should update guidance files so agents and humans see the same structure:

- `AGENTS.md`: replace SPA/React Router/`src/pages` instructions with Next.js App Router guidance.
- `CLAUDE.md`: remove stale CRA, React 18.2, gh-pages, `predeploy`, eject, and `src/App.js` guidance.
- `gemini.md`: rewrite the context from SPA to current Next.js App Router architecture.
- `README.md`: keep it concise, but include the canonical commands and validation gates.
- `QWEN.md`: correct remaining stale deploy/output statements and keep it consistent with current package scripts.
- `docs/refactoring-plan.md`: convert from an outdated aspirational plan into a current alignment roadmap.
- `docs/typescript-migration.md`: mark as historical or rewrite its top-level status so it no longer reads like future work against a JavaScript CRA app.

The documents should avoid promising scripts that do not exist and should use the current commands from `package.json`.

## Code Alignment

The first code pass should be conservative:

- Keep existing route URLs and generated static paths unchanged.
- Keep `src/views` as the current view layer unless a specific extraction improves clarity.
- Prefer small boundary clarifications over broad rewrites.
- If a stale name or import path points future work in the wrong direction, adjust it.
- If a large component is touched, extract only a well-bounded helper or child component that has a clear consumer and keeps behavior identical.
- Preserve existing ErrorBoundary, ToastProvider, LanguageProvider, and static layout behavior.

## Data Flow

Content edits should flow through:

1. Edit `src/data/siteData.json`.
2. Add or adjust translations in `src/utils/translateSiteData.ts` and locale JSON as needed.
3. Read normalized localized data via `getSiteData`, `getPageData`, `getAllWorks`, or `usePageData`.
4. Verify with `npm test`.

No page should introduce a second source of truth for works, news, events, artist profile, routes, or locale slugs.

## Error Handling and Operational Safety

- Keep major UI surfaces wrapped by the existing provider-level `ErrorBoundary`.
- Do not add empty catch blocks.
- Environment fallbacks should reflect the real intended public URL. If a fallback remains, document it as an intentional operational default.
- Any email/contact behavior changes must respect the operator experience, not just add local technical fallbacks.

## Verification Plan

The minimum verification for the first implementation pass is:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

If route, layout, navigation, not-found, or responsive UI code changes, also run the existing browser smoke path or a focused runtime check against representative Korean and English pages.

## Acceptance Criteria

- Repository guidance files no longer describe the app as a CRA/React Router SPA.
- Documented commands match `package.json`.
- Documented source locations match current files.
- `siteData.json` remains documented as the canonical content source.
- App Router route groups and locale URL behavior are documented as the current routing model.
- Existing validation commands pass after changes.
- Any code edits preserve current routes, sitemap count, locale work ID parity, static build, and TypeScript/lint cleanliness.

## Implementation Sequence

1. Update documentation to remove obsolete architecture instructions.
2. Run static searches for stale terms such as `Create React App`, `React Router`, `src/pages`, `src/App.js`, `gh-pages`, `predeploy`, and obsolete `build/` claims.
3. Make small code-boundary cleanups only where the stale documentation reveals an actual source of future confusion.
4. Run the verification plan.
5. Review diffs for behavior drift, generated-file churn, and unrelated changes.

