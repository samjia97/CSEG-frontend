# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 frontend for the CSEG (Computer Science Engineering Group) website. The project uses the App Router, TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### App Router Structure

The project uses Next.js App Router with file-based routing in the `app/` directory:
- `app/layout.tsx` - Root layout with global navigation (Navbar03)
- `app/page.tsx` - Home page
- `app/about/page.tsx` - About page
- Additional routes expected: `/events`, `/research_projects`, `/publications`, `/join`, `/contact`

### Navigation System

Navigation is centralized in `app/layout.tsx` where the `navigationLinks` array defines all routes. The `Navbar03` component (from `components/ui/shadcn-io/navbar-03/index.tsx`) handles both desktop and mobile navigation:
- Desktop: Horizontal navigation menu with hover underline animations
- Mobile: Hamburger menu with popover overlay
- Uses ResizeObserver to detect screen width and switch between layouts at 768px breakpoint

**Important**: Navigation menu items in Navbar03 currently use `onClick={(e) => e.preventDefault()}` which prevents default link behavior. This suggests navigation is intended to be handled programmatically via the Next.js router.

### Component System

The project uses shadcn/ui with the "new-york" style configuration:
- **Configuration**: `components.json` defines aliases and paths
- **UI Components Location**: `components/ui/`
- **Custom shadcn Components**: `components/ui/shadcn-io/` (contains modified shadcn components like Navbar03)
- **Standard Components**: `components/ui/button.tsx`, `components/ui/navigation-menu.tsx`, `components/ui/popover.tsx`, `components/ui/menu-button.tsx`
- **Utilities**: `lib/utils.ts` exports `cn()` for className merging using `clsx` and `tailwind-merge`

### Styling

- **Tailwind CSS v4** with PostCSS
- **CSS Variables**: Used for theming (see `app/globals.css`)
- **Fonts**: Geist Sans and Geist Mono (Google Fonts via next/font)
- **Color Scheme**: Neutral base color with primary/accent system
- **Icons**: Lucide React

### TypeScript Configuration

- **Path Aliases**: `@/*` maps to the root directory
- **JSX Runtime**: Modern `react-jsx` transform
- **Target**: ES2017
- **Strict Mode**: Enabled

## Important Notes

### Navigation Implementation

When working on navigation:
1. Update the `navigationLinks` array in `app/layout.tsx` when adding new routes
2. Create corresponding page.tsx files in the app directory
3. The Navbar03 component has a `handleMenuItemClicked` function (line 148) that should be connected to menu items for proper routing
4. Mobile menu items currently use `alert(link.href)` (line 186) instead of proper navigation - this needs to be fixed

### Component Development

- All new UI components should follow the shadcn/ui pattern with variant-based styling using `class-variance-authority`
- Use the `cn()` utility from `@/lib/utils` for conditional className merging
- Client-side interactivity requires `"use client"` directive at the top of the file
- Components should use the `React.forwardRef` pattern when they need to expose a ref

### Asset Management

- Static assets go in `public/` directory
- Logo is at `public/CSEG_Logo_Cropped.webp` (144x60px)
- Use Next.js `<Image>` component for optimized image loading

### Code Style

- Use TypeScript interfaces for component props (export them for reusability)
- Prefer named exports for components except page components
- Follow Next.js conventions: page.tsx for routes, layout.tsx for layouts
- Use Tailwind classes directly in components rather than separate CSS files