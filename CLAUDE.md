# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 frontend for the CSEG (Computer Science Education Group) website. The project uses the App Router, TypeScript, Tailwind CSS v4, and shadcn/ui components. Content is managed via a Strapi CMS backend.

## Development Commands

```bash
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm start       # Start production server
npm run lint    # Run ESLint
```

## Architecture

### Backend Integration

The frontend connects to a Strapi CMS:
- **API Client**: `lib/api.ts` - Axios instance with base URL from `NEXT_PUBLIC_BASE_URL` env var (defaults to `http://localhost:1337/api`)
- **Image Handling**: `getStrapiImageUrl()` converts relative Strapi image paths to full URLs
- **Image Domains**: Configured in `next.config.ts` for localhost:1337 and Strapi Cloud

### Data Fetching Pattern

Pages use server-side async components that fetch from Strapi:
```
app/[route]/page.tsx          # Page component (async, fetches data)
app/[route]/api/get-*.ts      # Data fetching functions using lib/api.ts
app/[route]/interactive-*.tsx # Client components for interactivity
```

Example: Events page fetches via `getEvents()` in `app/events/api/get-events.ts`, passes data to `InteractiveEvents` client component for filtering/sorting.

### Filtering System

Events and Publications use a complex filtering pattern:
- Query params: `timePeriod`, `openTo`, `tags`, `page`, `sort`, `query`
- Filter building with `qs.stringify()` for Strapi-compatible queries
- `EventFilterParams` type defines the filter structure with `$and`/`$or` operators

### App Router Structure

- `app/layout.tsx` - Root layout with Navbar03 and footer
- `app/page.tsx` - Home page with hero and card grid
- `app/events/` - Events listing with `[slug]` detail pages
- `app/research/` - Research projects with `[slug]` detail pages
- `app/publications/` - Publications listing with filtering
- `app/join/` - Join form with `api/create-application.ts` handler
- `app/about/` and `app/contact/` - Stub pages needing implementation

### Navigation System

Navigation is centralized in `app/layout.tsx`:
- `navigationLinks` array defines all routes
- `Navbar03` component handles responsive nav (768px breakpoint)
- Uses Next.js router for programmatic navigation via `handleMenuItemClicked()`

### Component System

shadcn/ui with "new-york" style:
- **Standard**: `components/ui/` (button, card, form, input, etc.)
- **Custom**: `components/ui/shadcn-io/navbar-03/` (modified navbar)
- **Utilities**: `lib/utils.ts` exports `cn()` for className merging

### Key Utilities

`lib/utils.ts`:
- `cn()` - Tailwind class merging
- `getSlug(title, documentId)` - Creates URL-friendly slugs with ID suffix
- `getDocumentIdFromSlug(slug)` - Extracts document ID from slug
- `strapiDateToDate(dateString)` - Parses Strapi date formats

`lib/formatters.ts`:
- `formatDate(date)` - Formats to GB locale (e.g., "20 November 2025")

### Styling

- **Tailwind CSS v4** with PostCSS and Lightning CSS
- **Theming**: CSS variables in oklch color space (`app/globals.css`)
- **Fonts**: Geist Sans and Geist Mono (next/font)
- **Icons**: Lucide React

### TypeScript

- **Path Aliases**: `@/*` maps to root directory
- **Strict Mode**: Enabled
- **Types**: `types/strapi-global-types.ts` for Strapi image types

## Important Notes

### Adding New Routes

1. Update `navigationLinks` array in `app/layout.tsx`
2. Create `app/[route]/page.tsx`
3. For Strapi content: create `app/[route]/api/get-*.ts` data fetcher

### Component Development

- Use `"use client"` directive for client-side interactivity
- Follow shadcn/ui patterns with `class-variance-authority` for variants
- Use `cn()` for conditional className merging
- Use `React.forwardRef` pattern when exposing refs

### Strapi Content

- Rich text renders via `@strapi/blocks-react-renderer`
- Images use `getStrapiImageUrl()` to build full URLs
- Populate relations with `qs.stringify({ populate: '*' })`