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
- Service ID: service_lop4659
- Template ID: template_wxwj093
- Public Key: E5wHxyFgSkrjQhYVG
- Contact form implemented in both standalone component and Contact page

### Deployment Architecture
- **Development**: Runs on `http://localhost:3000` (no basename)
- **Production**: Deployed to `https://hwangtab.github.io/home` (with `/home` basename)
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

# Using Gemini CLI for Large Codebase Analysis

  When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
  context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

  ## File and Directory Inclusion Syntax

  Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
   gemini command:

  ### Examples:

  **Single file analysis:**
  ```bash
  gemini -p "@src/main.py Explain this file's purpose and structure"

  Multiple files:
  gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"

  Entire directory:
  gemini -p "@src/ Summarize the architecture of this codebase"

  Multiple directories:
  gemini -p "@src/ @tests/ Analyze test coverage for the source code"

  Current directory and subdirectories:
  gemini -p "@./ Give me an overview of this entire project"
  
#
 Or use --all_files flag:
  gemini --all_files -p "Analyze the project structure and dependencies"

  Implementation Verification Examples

  Check if a feature is implemented:
  gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"

  Verify authentication implementation:
  gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"

  Check for specific patterns:
  gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"

  Verify error handling:
  gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"

  Check for rate limiting:
  gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"

  Verify caching strategy:
  gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"

  Check for specific security measures:
  gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"

  Verify test coverage for features:
  gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"

  When to Use Gemini CLI

  Use gemini -p when:
  - Analyzing entire codebases or large directories
  - Comparing multiple large files
  - Need to understand project-wide patterns or architecture
  - Current context window is insufficient for the task
  - Working with files totaling more than 100KB
  - Verifying if specific features, patterns, or security measures are implemented
  - Checking for the presence of certain coding patterns across the entire codebase

  Important Notes

  - Paths in @ syntax are relative to your current working directory when invoking gemini
  - The CLI will include file contents directly in the context
  - No need for --yolo flag for read-only analysis
  - Gemini's context window can handle entire codebases that would overflow Claude's context
  - When checking implementations, be specific about what you're looking for to get accurate results # Using Gemini CLI for Large Codebase Analysis


  When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
  context window. Use `gemini -p` to leverage Google Gemini's large context capacity.


  ## File and Directory Inclusion Syntax


  Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
   gemini command:


  ### Examples:


  **Single file analysis:**
  ```bash
  gemini -p "@src/main.py Explain this file's purpose and structure"


  Multiple files:
  gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"


  Entire directory:
  gemini -p "@src/ Summarize the architecture of this codebase"


  Multiple directories:
  gemini -p "@src/ @tests/ Analyze test coverage for the source code"


  Current directory and subdirectories:
  gemini -p "@./ Give me an overview of this entire project"
  # Or use --all_files flag:
  gemini --all_files -p "Analyze the project structure and dependencies"


  Implementation Verification Examples


  Check if a feature is implemented:
  gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"


  Verify authentication implementation:
  gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"


  Check for specific patterns:
  gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"


  Verify error handling:
  gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"


  Check for rate limiting:
  gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"


  Verify caching strategy:
  gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"


  Check for specific security measures:
  gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"


  Verify test coverage for features:
  gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"


  When to Use Gemini CLI


  Use gemini -p when:
  - Analyzing entire codebases or large directories
  - Comparing multiple large files
  - Need to understand project-wide patterns or architecture
  - Current context window is insufficient for the task
  - Working with files totaling more than 100KB
  - Verifying if specific features, patterns, or security measures are implemented
  - Checking for the presence of certain coding patterns across the entire codebase


  Important Notes


  - Paths in @ syntax are relative to your current working directory when invoking gemini
  - The CLI will include file contents directly in the context
  - No need for --yolo flag for read-only analysis
  - Gemini's context window can handle entire codebases that would overflow Claude's context
  - When checking implementations, be specific about what you're looking for to get accurate results