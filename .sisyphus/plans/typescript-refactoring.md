# TypeScript Migration Refinement Plan

## Status Assessment
The codebase has been nominally migrated to `.tsx`, but significantly relies on type suppressions (`@ts-nocheck`, `any`, `jsx-motion.d.ts`) to bypass compilation errors. This plan addresses the technical debt to achieve true type safety.

## Phase 1: Infrastructure Repair (Critical)
**Goal**: Restore the type system's ability to validate code.

1.  **Delete `src/types/jsx-motion.d.ts`**
    *   **Why**: This file suppresses all Framer Motion types globally.
    *   **Action**: Delete the file.
    *   **Fix**: Update components to import `HTMLMotionProps` from `framer-motion` where needed.

2.  **Fix `src/App.tsx`**
    *   **Action**: Remove `// @ts-nocheck`.
    *   **Fix**:
        *   Remove `as any` casts for `React.lazy`.
        *   Ensure `createLazyComponent` uses generic types: `Promise<{ default: ComponentType<any> }>`.

## Phase 2: Core UI Components (High Impact)
**Goal**: Ensure building blocks are type-safe.

1.  **Button Component (`src/components/ui/Button.tsx`)**
    *   Remove `// @ts-nocheck`.
    *   Remove `[key: string]: any` from `ButtonProps`.
    *   Extend `HTMLMotionProps<"button">` instead of `React.ButtonHTMLAttributes`.
    *   Fix `forwardRef` generic arguments.

2.  **Typography & Layout**
    *   Target: `src/components/ui/Typography.tsx`, `src/components/ui/Layout.tsx`.
    *   Remove `// @ts-nocheck`.
    *   Define strict interfaces for `Variant` and `Size` props.

## Phase 3: Data & Logic Components
**Goal**: Secure business logic with Discriminated Unions.

1.  **UnifiedWorkCard (`src/components/cards/UnifiedWorkCard.tsx`)**
    *   Remove `// @ts-nocheck`.
    *   **Problem**: Currently casts `Work` to an intersection type to bypass union checks.
    *   **Fix**: Use Type Guards or Discriminated Union checks (e.g., `if (work.archiveCategory === 'visual')`) to access specific properties like `images`.

2.  **SearchBar & Data Hooks**
    *   Target: `src/components/SearchBar.tsx`, `src/hooks/useDataProcessor.ts`.
    *   Replace `any` with `SiteData`, `Work`, `NewsItem`.

## Phase 4: Verification
1.  **Run Type Check**: `npx tsc --noEmit` should report zero errors.
2.  **Strict Mode**: Ensure `strict: true` in `tsconfig.json` remains enabled.

## Execution Order
Execute Phase 1 first, as it may expose errors in Phase 2/3 files that were previously hidden.

## Phase 5: The Long Tail (Iterative)
After fixing the core components, systematically remove `@ts-nocheck` from the remaining `src/components/ui/` files.
*   **Pattern**: Open file -> Remove nocheck -> Fix red squiggles -> Verify.
*   **Common Fixes**:
    *   Add types to `event` parameters (e.g., `React.ChangeEvent<HTMLInputElement>`).
    *   Add types to `children` props (`React.ReactNode`).
    *   Fix `framer-motion` variants types (`Variants` interface).
