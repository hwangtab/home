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
- **Styling**: Tailwind CSS 3.3.2 with PostCSS
- **Animation**: Framer Motion 6.5.1
- **Icons**: Lucide React 0.263.1
- **Email Service**: EmailJS 3.2.0
- **Testing**: React Testing Library with Jest
- **Deployment**: GitHub Pages via gh-pages

## Code Architecture

### Main Structure
- `src/App.js` - Main application component containing all sections and components
- `src/components/ContactForm.js` - Standalone contact form component (alternative implementation)
- `src/index.js` - React entry point
- `public/index.html` - HTML template with Korean language support and SEO meta tags

### Key Components in App.js
- `Header` - Navigation with Korean menu items
- `Section` - Reusable section wrapper with animation
- `MusicCard` - Music release display cards
- `NewSingleSection` - Featured single with YouTube embed and streaming links
- `ConcertSlider` - Animated concert schedule carousel
- `AlbumPurchase` - Album purchase interface
- `ContactForm` - Embedded contact form with EmailJS integration
- `ContactInfo` - Contact information display

### Styling System
- Uses Tailwind CSS with custom Korean fonts:
  - `font-bombaram`: HSBombaram3_Regular for headers
  - `font-santokki`: HSSanTokki20-Regular for titles
  - `font-wanted-sans`: Wanted Sans Variable for body text
- Color scheme: Dark theme with gray gradients
- Responsive design with mobile-first approach

### Data Structure
- Concert data stored in `concerts` array with title, date, location, and ticket URL
- Album data in `album` object with purchase information
- Music releases hardcoded in `MusicCard` components with external streaming links

## Important Notes

### EmailJS Integration
- Two implementations exist: embedded in App.js and standalone ContactForm.js
- Uses hardcoded service credentials (service_lop4659, template_wxwj093)
- Public key: E5wHxyFgSkrjQhYVG

### External Dependencies
- Images hosted on external services (ifh.cc, koreanmusicawards.com, etc.)
- YouTube video embeds for music content
- Links to Korean music platforms (Melon, Bugs, Genie, Vibe)

### Deployment
- Configured for GitHub Pages deployment
- Homepage set to: https://hwangtab.github.io/home
- SEO optimized with Korean language meta tags and structured data

## File Organization

```
src/
├── App.js           # Main application component
├── App.css          # App-specific styles
├── index.js         # React entry point
├── index.css        # Global styles
├── components/
│   └── ContactForm.js  # Alternative contact form implementation
└── [other CRA files]

public/
├── index.html       # HTML template with Korean SEO
├── favicon.ico      # Site icon
├── thumbnail.jpg    # Social media preview image
└── [other static assets]
```

## Content Management

The site content is primarily in Korean and includes:
- Artist biography and philosophy
- Music releases with streaming platform links
- Concert schedule management
- Contact information and inquiry form
- Social activism messaging throughout