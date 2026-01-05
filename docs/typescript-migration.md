# TypeScript Migration Guide

황경하 포트폴리오 웹사이트의 JavaScript에서 TypeScript로의 마이그레이션 가이드입니다.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Configuration](#project-configuration)
4. [Type Definitions](#type-definitions)
5. [Migration Order](#migration-order)
6. [Migration Patterns](#migration-patterns)
7. [Testing Strategy](#testing-strategy)
8. [Troubleshooting](#troubleshooting)
9. [Coding Conventions](#coding-conventions)

---

## Overview

### Current State
- **파일 수**: 76 JavaScript 파일
- **프레임워크**: React 18.2.0
- **빌드 시스템**: Create React App 5.0.1
- **스타일링**: Tailwind CSS 3.3.2
- **애니메이션**: Framer Motion 6.5.1

### Target State
- **언어**: TypeScript (strict mode)
- **타입 정의**: `src/types/` 디렉토리
- **Path Alias**: @components, @hooks, @pages 등
- **완전한 타입 안정성**: `any` 타입 최소화

### Migration Approach
점진적 마이그레이션 (Incremental Migration) 방식을 사용합니다:
1. `allowJs: true` 설정으로 JS/TS 혼용 허용
2. 의존성 순서대로 파일 변환
3. 각 레이어 완료 후 빌드 검증

---

## Prerequisites

### Required Dependencies

```bash
# TypeScript core
npm install --save-dev typescript

# React type definitions
npm install --save-dev @types/react @types/react-dom @types/node

# Router type definitions
npm install --save-dev @types/react-router-dom
```

### Already Typed Libraries (설치 불필요)
다음 라이브러리들은 내장 타입을 제공합니다:
- `framer-motion` - 내장 TypeScript 지원
- `lucide-react` - 내장 TypeScript 지원
- `fuse.js` - 내장 TypeScript 지원
- `photoswipe` - 내장 TypeScript 지원 (v5+)
- `react-player` - 내장 타입
- `emailjs-com` - 내장 타입
- `react-helmet-async` - 내장 타입

---

## Project Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    // Target & Library
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES2020"],

    // Module System
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,

    // JSX
    "jsx": "react-jsx",

    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    // Type Checking (Strict Mode)
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    // Migration Support
    "allowJs": true,
    "skipLibCheck": true,
    "noEmit": true,

    // Path Aliases
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@pages/*": ["pages/*"],
      "@context/*": ["context/*"],
      "@types/*": ["types/*"],
      "@constants/*": ["constants/*"],
      "@utils/*": ["utils/*"],
      "@config/*": ["config/*"],
      "@i18n/*": ["i18n/*"],
      "@data/*": ["data/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### react-app-env.d.ts

```typescript
/// <reference types="react-scripts" />

// SVG imports
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

// JSON imports
declare module '*.json' {
  const value: unknown;
  export default value;
}

// Image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
```

---

## Type Definitions

### Directory Structure

```
src/types/
├── index.ts           # 모든 타입 re-export
├── data.types.ts      # SiteData, Works, Artist 인터페이스
├── animation.types.ts # AnimationContext 관련 타입
├── component.types.ts # 컴포넌트 Props 타입
├── hook.types.ts      # Custom hook 반환 타입
├── context.types.ts   # Context value 타입
└── i18n.types.ts      # 번역 관련 타입
```

### Core Type Definitions

#### data.types.ts

```typescript
// Work Categories
export type WorkCategory = 'music' | 'visual' | 'writing' | 'performance' | 'struggle';
export type MusicType = 'album' | 'single';
export type ActionType = 'play' | 'read' | 'view' | 'watch' | 'link';
export type PageType = 'works' | 'archive' | 'about' | 'all';

// Primary Action
export interface PrimaryAction {
  type: ActionType;
  url: string;
  label: string;
}

// Base Work Interface
export interface BaseWork {
  id: string;
  title: string;
  year: number;
  type: string;
  cover?: string;
  description: string;
  shortDescription?: string;
  primaryAction?: PrimaryAction;
  tags?: string[];
  showInPages?: PageType[];
  archiveCategory: WorkCategory;
  sortPriority?: number;
}

// Specialized Work Types (Discriminated Union)
export interface MusicWork extends BaseWork {
  archiveCategory: 'music';
  type: MusicType;
  featured?: boolean;
}

export interface WritingWork extends BaseWork {
  archiveCategory: 'writing';
  publication?: string;
  excerpt?: string;
}

export interface VisualWork extends BaseWork {
  archiveCategory: 'visual';
  images?: string[];
}

export interface PerformanceWork extends BaseWork {
  archiveCategory: 'performance';
  location?: string;
  credits?: string[];
}

export type Work = MusicWork | WritingWork | VisualWork | PerformanceWork;

// Works Collection
export interface Works {
  music: MusicWork[];
  visual: VisualWork[];
  writing: WritingWork[];
  performance: PerformanceWork[];
  struggle?: Work[];
}

// Artist
export interface Contact {
  email: string;
  phone: string;
  address: string;
}

export interface Artist {
  name: string;
  bio: string;
  philosophy: string;
  contact: Contact;
}

// Events
export type ConcertStatus = 'upcoming' | 'past' | 'cancelled';

export interface Concert {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketUrl?: string;
  status: ConcertStatus;
}

export interface Events {
  concerts: Concert[];
}

// News
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  featured?: boolean;
}

// Metadata
export interface SiteMetadata {
  lastUpdated: string;
  version: string;
}

// Complete Site Data
export interface SiteData {
  metadata: SiteMetadata;
  artist: Artist;
  works: Works;
  events: Events;
  news: NewsItem[];
}
```

#### animation.types.ts

```typescript
import type { Transition, TargetAndTransition } from 'framer-motion';

// Animation States
export const ANIMATION_STATES = {
  IDLE: 'idle',
  PAGE_TRANSITION: 'page_transition',
  INTERACTIVE: 'interactive',
  BACKGROUND: 'background'
} as const;

export type AnimationState = typeof ANIMATION_STATES[keyof typeof ANIMATION_STATES];

// Animation Priorities
export const ANIMATION_PRIORITY = {
  PAGE_TRANSITION: 10,
  INTERACTIVE: 5,
  BACKGROUND: 1
} as const;

export type AnimationPriorityValue = typeof ANIMATION_PRIORITY[keyof typeof ANIMATION_PRIORITY];

// Animation Context
export interface AnimationContextValue {
  currentState: AnimationState;
  runningAnimations: Set<string>;
  startPageTransition: () => void;
  endPageTransition: () => void;
  registerAnimation: (id: string, priority?: AnimationPriorityValue) => boolean;
  unregisterAnimation: (id: string) => void;
  isAnimationAllowed: (priority?: AnimationPriorityValue) => boolean;
  shouldReduceAnimations: () => boolean;
  cleanup: () => void;
}

// Animation Presets
export interface AnimationPreset {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: Transition;
}

export interface CardAnimation {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  layout?: boolean;
  transition?: Transition;
  style?: React.CSSProperties;
}
```

#### component.types.ts

```typescript
import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Work } from './data.types';
import type { AnimationPreset } from './animation.types';

// Button Types
export type ButtonVariant =
  | 'primary'
  | 'solidarity'
  | 'earth'
  | 'harmony'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonAnimation = 'default' | 'bounce' | 'slide' | 'pulse' | 'subtle' | 'magnetic' | 'glow';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  animation?: ButtonAnimation;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loadingText?: string;
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactElement<{ size?: number }>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  animation?: ButtonAnimation;
  loading?: boolean;
  disabled?: boolean;
  'aria-label': string;
}

// Card Types
export interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  defaultSvg: string;
}

export interface UnifiedWorkCardProps {
  work: Work;
  onClick?: (work: Work) => void;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export type ThemeType = 'dark' | 'light';

export interface ContactFormProps {
  theme?: ThemeType;
  includeSubject?: boolean;
  title?: string;
  className?: string;
  animation?: AnimationPreset;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  duration?: number;
  action?: ToastAction;
  persistent?: boolean;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  action?: ToastAction;
  persistent: boolean;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, options?: ToastOptions) => number;
  removeToast: (id: number) => void;
  clearAllToasts: () => void;
  showSuccess: (message: string, options?: ToastOptions) => number;
  showError: (message: string, options?: ToastOptions) => number;
  showWarning: (message: string, options?: ToastOptions) => number;
  showInfo: (message: string, options?: ToastOptions) => number;
}

// Layout Types
export interface LayoutProps {
  children: ReactNode;
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

// Input Types
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  realTimeValidation?: boolean;
  validation?: (value: string) => string | null;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
```

#### hook.types.ts

```typescript
import type { Work, WorkCategory } from './data.types';

// useDataProcessor Types
export interface DataProcessorOptions<T> {
  filterKey?: keyof T;
  sortKey?: keyof T;
  sortOrder?: 'asc' | 'desc';
  groupBy?: keyof T | null;
  searchKeys?: (keyof T)[];
  enableSearch?: boolean;
  enableFilter?: boolean;
  enableSort?: boolean;
}

export interface DataStats {
  total: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
  latest: Work | null;
  oldest: Work | null;
}

export interface PaginationResult<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProcessFilters<T> {
  filterValue?: string;
  searchTerm?: string;
  customFilter?: (item: T) => boolean;
  page?: number;
  itemsPerPage?: number;
}

export interface DataProcessorReturn<T> {
  data: T[];
  groupedData: Record<string, T[]> | T[];
  filterData: (filterValue: string) => T[];
  searchData: (searchTerm: string, targetData?: T[]) => T[];
  paginateData: (targetData: T[], page?: number, itemsPerPage?: number) => PaginationResult<T>;
  processData: (filters?: ProcessFilters<T>) => T[] | PaginationResult<T>;
  uniqueFilterValues: string[];
  dataStats: DataStats;
  options: Required<DataProcessorOptions<T>>;
}

// useWorksData Types
export interface CategorizedData {
  music: Work[];
  visual: Work[];
  writing: Work[];
  performance: Work[];
  struggle: Work[];
  all: Work[];
}

export interface TimelineYear {
  year: number;
  events: Work[];
}

export interface YearlyStats {
  [year: number]: {
    total: number;
    byType: Record<string, number>;
  };
}

export interface WorksDataReturn extends DataProcessorReturn<Work> {
  categorizedData: CategorizedData;
  timelineData: TimelineYear[];
  flattenedEvents: Work[];
  yearlyStats: YearlyStats;
  getWorksByCategory: (category: WorkCategory) => Work[];
  getEventsByYear: (year: number) => Work[];
  getEventsByType: (type: string) => Work[];
  searchEvents: (searchTerm: string) => Work[];
}

// usePageState Types
export interface PageStateOptions {
  initialLoading?: boolean;
  enableBreadcrumb?: boolean;
  enableHistory?: boolean;
  storageKey?: string | null;
}

export interface Breadcrumb {
  label: string;
  path?: string;
}

export interface HistoryEntry {
  path: string;
  title?: string;
}

export interface PageStatus {
  isLoading: boolean;
  hasError: boolean;
  hasSuccess: boolean;
  isEmpty: boolean;
}

export interface PageStateReturn {
  isLoading: boolean;
  loadingMessage: string;
  error: Error | null;
  errorMessage: string;
  successMessage: string;
  pageTitle: string;
  pageDescription: string;
  breadcrumb: Breadcrumb[];
  pageHistory: HistoryEntry[];
  storageState: unknown;
  pageStatus: PageStatus;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setErrorState: (error: Error, message?: string) => void;
  clearError: () => void;
  showSuccess: (message: string, duration?: number) => void;
  clearSuccess: () => void;
  updatePageMeta: (title: string, description: string) => void;
  updateBreadcrumb: (crumbs: Breadcrumb[]) => void;
  addBreadcrumb: (crumb: Breadcrumb) => void;
  addToHistory: (page: HistoryEntry) => void;
  updateStorageState: (newState: unknown) => void;
  clearStorageState: () => void;
  resetPageState: () => void;
}

// useCardActions Types
export interface CardActionsOptions {
  enableLightbox?: boolean;
  enableMusicPlayer?: boolean;
  enableModal?: boolean;
}

export interface LightboxState {
  selectedImages: string[];
  lightboxIndex: number;
  isLightboxOpen: boolean;
  openLightbox: (work: Work) => void;
  closeLightbox: () => void;
  changeLightboxImage: (index: number) => void;
}

export interface MusicPlayerState {
  playlist: Work[];
  musicPlayerVisible: boolean;
  openMusicPlayer: (works: Work | Work[]) => void;
  closeMusicPlayer: () => void;
}

export interface ModalState {
  selectedItem: Work | null;
  isModalOpen: boolean;
  openModal: (item: Work) => void;
  closeModal: () => void;
}

export interface CardActions {
  handleCardClick: (work: Work) => void;
  openExternalLink: (url: string) => void;
  shareWork: (work: Work) => Promise<void>;
  toggleFavorite: (work: Work) => void;
  isFavorite: (workId: string) => boolean;
}

export interface CardActionsReturn {
  lightbox: LightboxState;
  musicPlayer: MusicPlayerState;
  modal: ModalState;
  actions: CardActions;
  favorites: string[];
}

// useFormState Types
export interface FormStatus {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isSubmitting: boolean;
}

export interface FieldProps<T> {
  value: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
}

export interface FormStateReturn<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  formStatus: FormStatus;
  handleChange: (name: keyof T, value: T[keyof T]) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => Promise<boolean>;
  validate: () => Partial<Record<keyof T, string>>;
  resetForm: () => void;
  resetField: (name: keyof T) => void;
  getFieldProps: <K extends keyof T>(name: K) => FieldProps<T[K]>;
}

// usePageData Types
export interface PageDataReturn<T = unknown> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
```

#### i18n.types.ts

```typescript
export type SupportedLanguage = 'ko' | 'en';

export interface NavigationTranslations {
  home: string;
  about: string;
  works: string;
  archive: string;
  news: string;
  contact: string;
}

export interface CommonTranslations {
  year: string;
  loading: string;
  search: string;
  searchPlaceholder: string;
  noResults: string;
  readMore: string;
  close: string;
  download: string;
  share: string;
  back: string;
  next: string;
  previous: string;
}

export interface Translations {
  nav: NavigationTranslations;
  common: CommonTranslations;
  home: Record<string, unknown>;
  about: Record<string, string>;
  works: Record<string, string>;
  archive: Record<string, string>;
  news: Record<string, string>;
  contact: Record<string, unknown>;
  player: Record<string, string>;
  footer: { copyright: string };
}

export interface LanguageContextValue {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (path: string) => string;
}
```

#### index.ts (Re-exports)

```typescript
// Data Types
export * from './data.types';

// Animation Types
export * from './animation.types';

// Component Types
export * from './component.types';

// Hook Types
export * from './hook.types';

// i18n Types
export * from './i18n.types';
```

---

## Migration Order

### Dependency Graph

```
Layer 0: Types & Constants (의존성 없음)
    ↓
Layer 1: Utilities & Simple Hooks (Types만 의존)
    ↓
Layer 2: Data & Context (Types + Utils 의존)
    ↓
Layer 3: Complex Hooks (Context + Types 의존)
    ↓
Layer 4-5: UI Components (Hooks + Types 의존)
    ↓
Layer 6-7: Feature & Effect Components (UI + Hooks 의존)
    ↓
Layer 8-9: Layout & Composite Components (모든 컴포넌트 의존)
    ↓
Layer 10: Pages (모든 컴포넌트 사용)
    ↓
Layer 11: Entry Points (모든 것 통합)
```

### Layer Details

#### Layer 0: Types & Constants
```
src/types/*.ts (신규 생성)
src/constants/animations.js → .ts
src/constants/styles.js → .ts
src/config/emailjs.js → .ts
```

#### Layer 1: Utilities & Simple Hooks
```
src/utils/imageOptimization.js → .ts
src/utils/lazyComponents.js → .ts
src/hooks/useIntersectionObserver.js → .ts
src/hooks/useLazyImage.js → .ts
src/hooks/useScrollAnimation.js → .ts
src/hooks/useKeyboardNavigation.js → .ts
src/hooks/useSwipeNavigation.js → .ts
```

#### Layer 2: Data & Context
```
src/data/index.js → .ts
src/context/AnimationContext.js → .tsx
src/i18n/index.js → .tsx
```

#### Layer 3: Complex Hooks
```
src/hooks/useDataProcessor.js → .ts
src/hooks/usePageState.js → .ts
src/hooks/useCardActions.js → .ts
src/hooks/usePageData.js → .ts
src/hooks/useSEO.js → .ts
```

#### Layer 4: Simple UI Components
```
src/components/ui/LoadingSpinner.js → .tsx
src/components/ui/Skeleton.js → .tsx
src/components/ui/SkeletonCard.js → .tsx
src/components/ui/SkeletonUI.js → .tsx
src/components/ui/ProgressBar.js → .tsx
src/components/ui/ScrollProgress.js → .tsx
src/components/ui/Typography.js → .tsx
src/components/ui/ColorSystem.js → .tsx
```

#### Layer 5: Interactive UI Components
```
src/components/ui/Button.js → .tsx
src/components/ui/Card.js → .tsx
src/components/ui/FormElements.js → .tsx
src/components/ui/Toast.js → .tsx
src/components/ui/AnimatedComponents.js → .tsx
src/components/ui/PageIndicator.js → .tsx
src/components/ui/MobileMenu.js → .tsx
src/components/ui/VirtualGrid.js → .tsx
```

#### Layer 6: Feature Components
```
src/components/cards/DefaultImageComponent.js → .tsx
src/components/cards/UnifiedWorkCard.js → .tsx
src/components/OptimizedImage.js → .tsx
src/components/ContactForm.js → .tsx
src/components/SearchBar.js → .tsx
src/components/MusicPlayer.js → .tsx
src/components/Lightbox.js → .tsx
src/components/VideoGallery.js → .tsx
```

#### Layer 7: Effect Components
```
src/components/effects/CustomCursor.js → .tsx
src/components/effects/TypewriterEffect.js → .tsx
src/components/effects/AnimatedProfession.js → .tsx
src/components/effects/DynamicBackground.js → .tsx
src/components/effects/InteractiveElements.js → .tsx
src/components/effects/AlbumCarousel.js → .tsx
```

#### Layer 8: Layout & Navigation
```
src/components/Layout.js → .tsx
src/components/ui/Layout.js → .tsx
src/components/Section.js → .tsx
src/components/ErrorBoundary.js → .tsx
src/components/transitions/PageTransition.js → .tsx
src/components/accessibility/SkipLinks.js → .tsx
src/components/SEO/MetaDataManager.js → .tsx
```

#### Layer 9: Composite Components
```
src/components/PageHero.js → .tsx
src/components/WorksHeader.js → .tsx
src/components/WorksFilter.js → .tsx
src/components/WorksGrid.js → .tsx
src/components/CardRenderer.js → .tsx
src/components/DataRenderer.js → .tsx
src/components/AlbumMosaic.js → .tsx
src/components/MinimalBranding.js → .tsx
src/components/ArtisticOverlay.js → .tsx
src/components/LanguageToggle.js → .tsx
src/components/LazyComponents.js → .tsx
```

#### Layer 10: Pages
```
src/pages/Home.js → .tsx
src/pages/About.js → .tsx
src/pages/Works.js → .tsx
src/pages/News.js → .tsx
src/pages/Contact.js → .tsx
```

#### Layer 11: Entry Points
```
src/App.js → .tsx
src/index.js → .tsx
src/reportWebVitals.js → .ts
src/setupTests.js → .ts
src/App.test.js → .tsx
```

---

## Migration Patterns

### Simple Component Pattern

**Before (JavaScript):**
```javascript
import React, { memo } from 'react';

const Component = ({ title, onClick, className = '' }) => {
  return (
    <div className={className} onClick={onClick}>
      {title}
    </div>
  );
};

export default memo(Component);
```

**After (TypeScript):**
```typescript
import React, { memo } from 'react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({
  title,
  onClick,
  className = ''
}) => {
  return (
    <div className={className} onClick={onClick}>
      {title}
    </div>
  );
};

export default memo(Component);
```

### forwardRef Component Pattern

**Before:**
```javascript
import React, { forwardRef, memo } from 'react';

const Button = forwardRef(({ children, variant = 'primary', ...props }, ref) => {
  return (
    <button ref={ref} className={`btn-${variant}`} {...props}>
      {children}
    </button>
  );
});

export default memo(Button);
```

**After:**
```typescript
import React, { forwardRef, memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', ...props }, ref) => {
    return (
      <button ref={ref} className={`btn-${variant}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default memo(Button);
```

### Custom Hook Pattern

**Before:**
```javascript
import { useState, useCallback } from 'react';

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
};
```

**After:**
```typescript
import { useState, useCallback } from 'react';

interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export const useToggle = (initialValue = false): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback((): void => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback((): void => setValue(true), []);
  const setFalse = useCallback((): void => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
};
```

### Context Pattern

**Before:**
```javascript
import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [value, setValue] = useState(null);

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

**After:**
```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MyContextValue {
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const MyContext = createContext<MyContextValue | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode;
}

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = (): MyContextValue => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

### Event Handler Pattern

**Before:**
```javascript
const handleClick = (e) => {
  e.preventDefault();
  // ...
};

const handleChange = (e) => {
  const value = e.target.value;
  // ...
};
```

**After:**
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  // ...
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const value = e.target.value;
  // ...
};
```

### JSON Import Pattern

**Before:**
```javascript
import siteData from './siteData.json';

// siteData is untyped
```

**After:**
```typescript
import siteDataJson from './siteData.json';
import type { SiteData } from '@types/data.types';

const siteData = siteDataJson as SiteData;
```

---

## Testing Strategy

### Pre-Migration Baseline
```bash
# 현재 빌드 상태 확인
npm run build

# 테스트 실행
npm test

# 결과 기록
```

### Layer Completion Verification
각 레이어 완료 후:
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# 빌드 확인
npm run build

# 개발 서버 실행
npm start

# 수동 UI 테스트
```

### Final Verification
```bash
# 전체 타입 체크
npx tsc --noEmit

# 프로덕션 빌드
npm run build

# 테스트 스위트 실행
npm test

# 모든 페이지 수동 테스트
# - 홈페이지 (/, /home)
# - 소개 (/about)
# - 작업 (/works)
# - 뉴스 (/news)
# - 연락처 (/contact)
```

---

## Troubleshooting

### Common Issues

#### 1. Module not found error with path aliases
```
Cannot find module '@components/Button'
```

**Solution**: CRA에서 path alias를 사용하려면 `craco`나 `react-app-rewired`가 필요합니다. 또는 상대 경로를 유지하세요.

```bash
# craco 설치
npm install @craco/craco

# craco.config.js 생성
```

#### 2. Type 'X' is not assignable to type 'Y'
```typescript
// 문제
const data: SiteData = jsonData; // Error

// 해결: Type assertion 사용
const data = jsonData as SiteData;

// 또는 런타임 검증 추가
const data = validateSiteData(jsonData);
```

#### 3. Property does not exist on type
```typescript
// 문제
work.unknownProperty // Error

// 해결: 타입 가드 사용
if ('unknownProperty' in work) {
  work.unknownProperty;
}

// 또는 optional chaining
work?.unknownProperty;
```

#### 4. Implicit 'any' type
```typescript
// 문제
const handleClick = (e) => {} // Error in strict mode

// 해결: 명시적 타입 지정
const handleClick = (e: React.MouseEvent) => {}
```

#### 5. Object is possibly 'undefined'
```typescript
// 문제
const value = obj.property; // Error if obj might be undefined

// 해결 1: Optional chaining
const value = obj?.property;

// 해결 2: Non-null assertion (확신할 때만)
const value = obj!.property;

// 해결 3: Type guard
if (obj) {
  const value = obj.property;
}
```

#### 6. Framer Motion typing issues
```typescript
// 문제
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}; // Type inference issues

// 해결: Variants 타입 사용
import { Variants } from 'framer-motion';

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};
```

---

## Coding Conventions

### File Naming
- 컴포넌트: `PascalCase.tsx` (예: `Button.tsx`)
- 훅: `camelCase.ts` (예: `useDataProcessor.ts`)
- 타입: `*.types.ts` (예: `data.types.ts`)
- 상수: `camelCase.ts` (예: `animations.ts`)

### Type Naming
- 인터페이스: `PascalCase` (예: `ButtonProps`)
- 타입 별칭: `PascalCase` (예: `ButtonVariant`)
- Enum 상수: `SCREAMING_SNAKE_CASE` (예: `ANIMATION_STATES`)

### Import Order
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { motion } from 'framer-motion';

// 3. Type imports
import type { Work, SiteData } from '@types';

// 4. Local imports
import { Button } from '@components/ui/Button';

// 5. Style imports (if any)
import './styles.css';
```

### Props Interface Convention
```typescript
// 컴포넌트 Props는 컴포넌트와 같은 파일에 정의
// 또는 component.types.ts에 정의 후 import

interface ComponentProps {
  // Required props first
  id: string;
  title: string;

  // Optional props with defaults
  className?: string;
  disabled?: boolean;

  // Callback props
  onClick?: (id: string) => void;
  onChange?: (value: string) => void;

  // Children prop
  children?: React.ReactNode;
}
```

### Avoid `any` Type
```typescript
// Bad
const data: any = fetchData();

// Good
const data: SiteData = fetchData();

// If type is truly unknown, use unknown
const data: unknown = fetchData();
if (isSiteData(data)) {
  // data is now SiteData
}
```

### Use Type Inference
```typescript
// Unnecessary explicit typing
const count: number = 0;
const name: string = 'hello';

// Let TypeScript infer
const count = 0;
const name = 'hello';

// Explicit when inference isn't clear
const data: Work[] = [];
const map: Map<string, Work> = new Map();
```

---

## Checklist

### Pre-Migration
- [ ] Git 브랜치 생성 (`feature/typescript-migration`)
- [ ] 현재 빌드 상태 확인 (`npm run build`)
- [ ] 테스트 통과 확인 (`npm test`)

### Foundation
- [ ] TypeScript 패키지 설치
- [ ] `tsconfig.json` 생성
- [ ] `react-app-env.d.ts` 생성
- [ ] `src/types/` 디렉토리 생성

### Type Definitions
- [ ] `data.types.ts` 완료
- [ ] `animation.types.ts` 완료
- [ ] `component.types.ts` 완료
- [ ] `hook.types.ts` 완료
- [ ] `i18n.types.ts` 완료
- [ ] `index.ts` (re-exports) 완료

### Layer Migration
- [ ] Layer 0: Constants & Config
- [ ] Layer 1: Utilities & Simple Hooks
- [ ] Layer 2: Data & Context
- [ ] Layer 3: Complex Hooks
- [ ] Layer 4: Simple UI Components
- [ ] Layer 5: Interactive UI Components
- [ ] Layer 6: Feature Components
- [ ] Layer 7: Effect Components
- [ ] Layer 8: Layout & Navigation
- [ ] Layer 9: Composite Components
- [ ] Layer 10: Pages
- [ ] Layer 11: Entry Points

### Post-Migration
- [ ] `allowJs: false` 설정 (모든 파일 변환 후)
- [ ] 전체 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] 프로덕션 빌드 성공 (`npm run build`)
- [ ] 모든 테스트 통과 (`npm test`)
- [ ] 모든 페이지 수동 테스트
- [ ] main 브랜치에 머지

---

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Framer Motion TypeScript](https://www.framer.com/motion/typescript/)
- [CRA with TypeScript](https://create-react-app.dev/docs/adding-typescript/)
