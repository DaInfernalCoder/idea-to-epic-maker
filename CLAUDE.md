# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 8080)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Project Architecture

This is a **PromptFlow** application - an AI-powered project planning wizard that transforms user requirements into comprehensive development documentation through a multi-step process.

### Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **State Management**: React Query + Context API
- **Routing**: React Router v6

### Application Flow
The app centers around a **6-step wizard** that guides users through project creation:

1. **Requirements**: Initial project description capture
2. **Brainstorm**: Feature selection and technology stack choice
3. **Research**: AI-generated technical research analysis
4. **PRD**: AI-generated Product Requirements Document
5. **Epics**: AI-generated development task breakdown
6. **Completion**: Export and summary

### Authentication System
- **Dual-mode authentication**: Supports both authenticated users and guest mode
- **Guest limitations**: 24-hour sessions with rate limiting (8 AI generations/hour)
- **Authenticated users**: Full access with data persistence to Supabase
- **Data storage**: Guest data in localStorage, authenticated data in Supabase

### Key Components Structure
- `src/components/wizard/`: Complete wizard flow components
- `src/components/auth/`: Authentication handling
- `src/components/onboarding/`: User onboarding modals
- `src/hooks/useProject.tsx`: Central project data management
- `src/hooks/useAuth.tsx`: Authentication state management

### Supabase Edge Functions
- `generate-research`: Creates technical research from requirements
- `generate-prd`: Creates PRD from research and brainstorm data
- `generate-epics`: Creates development epics from PRD
- `save-doc`: Persists project data for authenticated users
- `log-prompt`: Tracks AI usage for rate limiting

### Data Management
Project data flows progressively through wizard steps:
- Each step builds upon previous step data
- Authenticated users: Real-time Supabase sync
- Guest users: localStorage-only persistence
- Export capability: Final output as downloadable Markdown

### Path Aliases
- `@/*` maps to `src/*` for clean imports

### Rate Limiting
Guest users are limited to prevent abuse while maintaining usability. Authenticated users have higher limits.