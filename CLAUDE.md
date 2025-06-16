# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuppleFlow is a modern React web application for supplement tracking and management with AI-powered insights. Users can manage multiple profiles, track supplement intake, and receive personalized recommendations. The app uses local browser storage for data persistence, making it privacy-focused and offline-capable.

## Development Commands

```bash
# Development server (runs on port 8080)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Linting
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **React 18** with TypeScript and Vite build tool
- **Shadcn UI** components built on Radix UI primitives
- **Tailwind CSS** with custom theme system
- **TanStack React Query** for client state management and caching
- **Local Storage Database** for client-side data persistence
- **OpenAI API** for AI insights (GPT-3.5-turbo)

### Key Directories
- `src/components/` - React components (includes `ui/` for Shadcn components)
- `src/pages/` - Page-level components
- `src/hooks/` - Custom hooks for data fetching and business logic
- `src/lib/` - Utilities, local database client, and configurations
- `src/context/` - React contexts for global state

### Database Schema
- **Profiles**: User management with multiple profile support
- **Supplements**: Supplement definitions with dosage information
- **Intakes**: Logged supplement intakes with timestamps and notes

### Custom Hooks Pattern
The codebase uses custom hooks for all data operations:
- `use-user-profiles.ts` - User profile management
- `use-supplements.ts` - Supplement CRUD operations
- `use-intakes.ts` - Intake logging and retrieval
- `use-ai-insights.ts` - OpenAI integration for recommendations

### Component Architecture
- Follows Shadcn UI conventions with `@/components/ui/` imports
- Uses React Hook Form with Zod validation
- Implements loading states and error boundaries
- Toast notifications via Sonner

## Configuration Notes

### Environment Variables
Optional in `.env`:
- `VITE_OPENAI_API_KEY` - OpenAI API key (required only for AI insights)

### Build Configuration
- Vite config uses port 8080 for development
- TypeScript path aliases: `@/` maps to `src/`
- React SWC plugin for fast compilation
- Component tagger enabled in development mode only

### Styling System
- Tailwind CSS with custom CSS variables for theming
- Dark/light theme support via next-themes
- Custom design tokens defined in `tailwind.config.ts`

## Data Storage Integration

### Local Storage Database
- Located in `src/lib/local-storage-db.ts`
- Includes TypeScript types for all data structures
- JSON-based storage with localStorage persistence
- Automatic data serialization/deserialization

### Data Management Pattern
- All data operations use React Query for caching and state management
- Custom hooks wrap localStorage operations with proper error handling
- Synchronous operations with immediate updates
- No network latency - all operations are instant

## AI Integration

The OpenAI integration provides personalized supplement insights:
- Uses GPT-3.5-turbo model
- Configured with `dangerouslyAllowBrowser: true` for client-side use
- Analyzes user's supplement data and intake patterns
- Provides safety recommendations and optimization suggestions

## Key Benefits of Local Storage Architecture

- **Privacy**: All user data stays on their device
- **Performance**: Instant operations without network requests
- **Offline Capability**: Works without internet connection
- **Simplicity**: No database setup or server maintenance required
- **Portability**: Easy to backup/restore via browser dev tools