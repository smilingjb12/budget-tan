# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **TanStack Start** application - a type-safe, client-first, full-stack React framework built on top of TanStack Router. The project demonstrates a complete web application with file-based routing, server-side rendering, and modern React patterns.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (runs Vite build + TypeScript check)  
- `npm run start` - Start production server from built files
- `npm install` or `pnpm install` - Install dependencies (project uses npm but README suggests pnpm)

## Architecture & Key Concepts

### File-Based Routing
The application uses TanStack Router's file-based routing system:
- **Route files** in `src/routes/` define URL paths and components
- **Route tree** is auto-generated in `src/routeTree.gen.ts` (read-only, excluded from search/watch)
- **Router configuration** in `src/router.tsx` sets up the main router instance

### Key Directories
- `src/routes/` - Route components with file-based routing conventions
- `src/components/` - Reusable components (error boundaries, not found pages)  
- `src/server/` - Server functions using TanStack Start's `createServerFn()` 
- `src/services/` - Business logic and data access layer using Service delegation pattern
- `src/db/` - Database schema, migrations, and Drizzle ORM configuration
- `src/utils/` - Utility functions (SEO helpers, middleware, data fetching)
- `src/lib/` - Shared utilities, hooks, and helper functions
- `src/styles/` - CSS files (using Tailwind CSS)

### Routing Patterns
- `__root.tsx` - Root layout component with navigation and global setup
- `index.tsx` - Home page route
- `posts/` - Nested routes with dynamic segments (`$postId`)
- `users/` - Similar nested structure for user pages
- `_pathlessLayout/` - Layout routes that don't affect URL structure
- API routes for server-side functionality

### TypeScript Configuration
- Path mapping with `~/*` alias pointing to `src/*`
- Strict TypeScript configuration
- Module resolution set to "Bundler" for Vite compatibility

### Server Functions & Architecture
- **Server functions** are located in `src/server/` folder and use TanStack Start's `createServerFn()`
- **Service delegation pattern**: Server functions delegate to services in `src/services/` for business logic
- Services handle all database operations, validation, and data transformation
- Server functions act as thin API layer that calls appropriate service methods
- The build process automatically adds `'use server'` directives - no manual addition needed

### Database & Data Access
- **PostgreSQL** as the database
- **Drizzle ORM** for type-safe database queries and migrations
- Database configuration in `src/db/index.ts` with connection pooling
- Schema definitions in `src/db/schema/schema.ts`
- Migration files in `src/db/migrations/`

**IMPORTANT: Database Migrations**
- When modifying `src/db/schema/schema.ts`, you MUST generate a migration using `npx drizzle-kit generate`
- The migration generator will detect changes and prompt for actions (create/rename/delete columns)
- Always run migrations with `npm run migrate` before starting the application
- Migration files are automatically numbered and tracked in `src/db/migrations/meta/_journal.json`
- **NEVER manually create migration files** - always use `npx drizzle-kit generate` to ensure proper metadata and hashing
- If the migration generator cannot be run programmatically, ask the user to run `npx drizzle-kit generate` manually

### UI Components & Styling
- **shadcn/ui** components for consistent, accessible UI elements
- **Tailwind CSS** for styling with utility-first approach
- **Radix UI** primitives as the foundation for complex components
- PostCSS configuration for processing
- Global styles in `src/styles/app.css`
- Custom utility function `cn()` in `src/lib/utils.ts` for className merging

### Additional Libraries & Tools
- **React Hook Form** with Zod validation for form handling
- **TanStack Query** for server state management
- **TanStack Table** for data tables
- **Recharts** for data visualization and charts
- **date-fns** for date manipulation
- **Jotai** for state management
- **Lucide React** for icons

### Development Features  
- **Hot reload** during development
- **TypeScript checking** during build process
- **TanStack Router Devtools** enabled in development
- **ESLint** with TanStack-specific rules for code quality
- Custom Vite configuration with React plugin and path resolution

### Architecture Principles
The application follows a clean architecture with clear separation of concerns:
- **Routes** handle UI and user interactions
- **Server functions** provide thin API endpoints
- **Services** contain business logic and data access
- **Components** are reusable UI elements
- The generated route tree should never be manually edited