# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React portfolio website for Korean musician and producer 황경하 (Hwang Gyeongha). The site showcases music releases, concert information, and contact details, with a focus on social activism and solidarity through music.

## Development Commands

### Core Commands
- `npm start` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle to `build/` folder
- `npm test` - Run tests in interactive watch mode
- `npm run deploy` - Deploy to GitHub Pages (runs `predeploy` first)

### Additional Commands
- `npm run predeploy` - Build production bundle (runs automatically before deploy)
- `npm run eject` - Eject from Create React App (one-way operation)
- `npm run analyze` - Build and serve locally for analysis
- `npm run build:analyze` - Build and analyze bundle size with webpack-bundle-analyzer

### Development Environment
- **Node.js**: Project uses React 18.2.0 and Node.js ecosystem
- **No linting/typecheck commands**: This project doesn't have eslint or typescript setup
- **Testing**: Uses React Testing Library with Jest (run `npm test` for interactive mode)

## Technology Stack

- **Framework**: React 18.2.0 with Create React App
- **Routing**: React Router DOM 7.6.3
- **Styling**: Tailwind CSS 3.3.2 with PostCSS
- **Animation**: Framer Motion 6.5.1
- **Icons**: Lucide React 0.263.1
- **Email Service**: EmailJS 3.2.0
- **Search**: Fuse.js 7.1.0 for fuzzy search
- **Media**: React Player 3.1.0, PhotoSwipe 5.4.4
- **Testing**: React Testing Library with Jest
- **Deployment**: GitHub Pages via gh-pages

## Code Architecture

### Multi-Page Application Structure
The application has evolved from a single-page to a multi-page React application with:

- `src/App.js` - Root component with React Router setup and conditional basename
- `src/pages/` - Individual page components (Home, About, Works, Archive, News, Contact)
- `src/components/` - Reusable UI components
- `src/data/siteData.json` - Centralized data source
- `src/i18n/` - Internationalization system

### Key Architecture Patterns

**Router Configuration**:
- Uses conditional basename: production uses `/home`, development uses empty string
- Configured in App.js with environment-based routing

**Data Management**:
- Centralized data in `src/data/siteData.json` containing:
  - Artist metadata and contact information
  - Music works (albums organized by type)
  - Visual arts (photography, videos)
  - Writing portfolio
  - Performance history
  - Timeline events for archive page

**Component System**:
- `Layout.js` - Provides consistent header/navigation across pages
- `Section.js` - Reusable section wrapper with Framer Motion animations
- Multiple card components for different content types (Music, Visual, Writing, Performance)
- Specialized components: MusicPlayer, Lightbox, VideoGallery, SearchBar

**Animation Architecture**:
- `AnimationContext.js` - Centralized animation state management with priority system
- Animation states: IDLE, PAGE_TRANSITION, INTERACTIVE, BACKGROUND
- Performance optimization with animation limiting and mobile-specific constraints
- Global animation pause/resume system for page transitions

### Styling System
- Uses Tailwind CSS with custom Korean fonts:
  - `font-bombaram`: HSBombaram3_Regular for headers
  - `font-santokki`: HSSanTokki20-Regular for titles
  - `font-wanted-sans`: Wanted Sans Variable for body text
- Color scheme: Dark theme with gray gradients
- Responsive design with mobile-first approach
- Custom utilities in `src/index.css` including line-clamp classes

### Data Flow Architecture
- **Single Source of Truth**: `siteData.json` contains all content
- **Page-Specific Filtering**: Each page component filters relevant data
- **Component Props**: Data flows down through props to display components
- **No State Management Library**: Uses React's built-in state and context

## Important Notes

### Environment Configuration
- `.env` file controls build settings:
  - `PUBLIC_URL=` (empty for development)
  - `GENERATE_SOURCEMAP=false` for production builds

### EmailJS Integration
- Service ID: `$NEXT_PUBLIC_EMAILJS_SERVICE_ID` (환경 변수로 관리)
- Template ID: `$NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` (환경 변수로 관리)
- Public Key: `$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (환경 변수로 관리)
- Contact form implemented in both standalone component and Contact page

### Deployment Architecture
- **Development**: Runs on `http://localhost:3000` (no basename)
- **Production**: Deployed to `https://hwangtab.github.io/home` (with `/home` basename)
- **Vercel**: Alternative deployment via `vercel.json` with SPA routing configuration
- Router automatically adjusts basename based on NODE_ENV

### Content Structure
- All content is in Korean with English internationalization support
- External dependencies: images from ifh.cc, koreanmusicawards.com
- Music platform integration: Melon, Bugs, Genie, Vibe
- YouTube embeds for music/video content

## Current Refactoring Context

A comprehensive refactoring plan exists in `docs/refactoring-plan.md` addressing:
- Data unification across all pages (Works, Archive, About)
- Component consolidation to reduce code duplication
- Performance optimization with memoization and image optimization
- Error handling and loading states
- Accessibility improvements
- Potential TypeScript migration

The codebase is in active development with plans to consolidate card components and create a unified data rendering system across all pages.

## Development Guidelines

### Working with the Component System
- Always check existing components in `src/components/` before creating new ones
- Follow the established card component patterns when creating content displays
- Use the centralized `siteData.json` for all content data
- Maintain consistency with Korean font usage: `font-bombaram`, `font-santokki`, `font-wanted-sans`

### Performance Considerations
- Images are loaded from external sources (ifh.cc, koreanmusicawards.com) - consider caching strategies
- Use React.memo for components that render frequently
- Implement proper loading states for async content

### Code Patterns
- Use Framer Motion for animations following existing patterns
- EmailJS integration is centralized in `src/config/emailjs.js`
- Error boundaries should wrap major component sections
- All pages should use the `Layout` component for consistent structure
- Animation components should use `AnimationContext` for proper state management
- Custom Tailwind theme includes Korean color philosophy (brand.solidarity, brand.earth, brand.harmony)

### File Organization
- `/src/pages/` - Page components (Home, About, Works, Archive, News, Contact)
- `/src/components/ui/` - Reusable UI components and design system
- `/src/components/effects/` - Animation and visual effect components
- `/src/components/transitions/` - Page transition components
- `/src/hooks/` - Custom React hooks for common functionality
- `/src/context/` - React context providers (currently AnimationContext)
- `/src/config/` - Configuration files (EmailJS, etc.)
- `/src/constants/` - Shared constants and configuration values

### Testing
- Run `npm test` for unit tests
- Test email functionality requires valid EmailJS configuration
- Check responsive design across different screen sizes