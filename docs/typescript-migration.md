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
