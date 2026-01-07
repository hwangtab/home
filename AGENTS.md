# AGENTS.md

This file provides guidance for agentic coding agents operating in this repository.

## Project Overview

React portfolio website for Korean musician 황경하 (Hwang Gyeongha). Multi-page SPA with Framer Motion animations, Tailwind CSS styling, and TypeScript.

## Build & Test Commands

### Core Commands
- `npm start` - Start dev server at http://localhost:3000
- `npm run build` - Production build to `build/` folder
- `npm run deploy` - Deploy to GitHub Pages

### Testing
- `npm test` - Run all tests in interactive watch mode
- `npm test -- --testPathPattern="filename"` - Run single test file
- `npm test -- --testNamePattern="test name"` - Run tests matching name
- `npm test -- --watchAll=false` - Run tests once without watch mode

### Type Checking
- `npx tsc --noEmit` - Run TypeScript compiler for type errors

## Code Style Guidelines

### File Organization
- Use `.tsx` for React components, `.ts` for utilities/hooks
- Component files: `PascalCase.tsx`
- Utility/hook files: `camelCase.ts`
- Place components in `src/components/`, pages in `src/pages/`

### Imports
```typescript
// React imports
import React, { useState, useEffect, useCallback } from 'react';

// Named imports (no default for libraries)
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Type imports
import type { Work, Concert, NewsItem } from '../types/data.types';
```

### TypeScript Rules
- Use explicit types for props, function parameters, and return values
- Use `interface` for object types, `type` for unions/primitives
- Avoid `any` - use `unknown` and type guards instead
- Use `React.FC<Props>` for functional component types
- Create shared types in `src/types/`

### Naming Conventions
- Components: `PascalCase` (e.g., `MusicPlayer`)
- Hooks: `camelCase` with `use` prefix (e.g., `useScrollAnimation`)
- Constants: `SCREAMING_SNAKE_CASE`
- Interfaces: `PascalCase` (e.g., `ScrollAnimationOptions`)
- Files: `kebab-case.tsx`

### Error Handling
- Never use empty catch blocks: `catch(e) {}`
- Always handle or log errors appropriately
- Use ErrorBoundary components for component sections
- Provide user-friendly error messages in UI

### Component Patterns

**Framer Motion animations:**
```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.5 }}
>
```

**Hooks with dependencies:**
```typescript
const handleCallback = useCallback(() => {
  // logic using dependencies
}, [dep1, dep2]); // Ensure all deps are listed
```

### Tailwind CSS
- Use Korean font classes: `font-bombaram`, `font-santokki`, `font-wanted-sans`
- Dark theme: `bg-gray-900`, `text-gray-100`
- Use `md:` and `lg:` breakpoints for responsive design

### Data Management
- Centralized data: `src/data/siteData.json`
- Custom hooks: `src/hooks/` for reusable logic
- Animation state: Use `AnimationContext` for global control

## Key Files

- `src/App.tsx` - Root with React Router
- `src/components/Layout.tsx` - Main layout with navigation
- `src/context/AnimationContext.tsx` - Animation state management
- `src/types/` - Shared TypeScript interfaces
- `src/types/jsx-motion.d.ts` - Framer Motion type declarations
