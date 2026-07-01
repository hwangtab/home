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
