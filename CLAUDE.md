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
- `src/utils/` - Utility functions (SEO helpers, middleware, data fetching)
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

### Styling
- **Tailwind CSS** for styling
- PostCSS configuration for processing
- Global styles in `src/styles/app.css`

### Development Features  
- **Hot reload** during development
- **TypeScript checking** during build process
- **TanStack Router Devtools** enabled in development
- Custom Vite configuration with React plugin and path resolution

The application structure follows TanStack Start conventions with clear separation between routes, components, and utilities. The generated route tree should never be manually edited.