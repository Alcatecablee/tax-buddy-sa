# South African Tax Calculator

## Overview
**EMERGENCY SIMPLIFICATION (Nov 2025)**: After 7+ months live with zero users, the project has been stripped down to its core: a single, focused tax refund calculator. No features. No dashboards. No integrations. Just the calculator.

**Current Goal**: Validate if anyone wants a tax calculator before building anything else. Get 50-100 real users to test it in the next 2 weeks.

**The Lesson**: Building solutions looking for problems doesn't work. Ship the simplest thing, validate with real users, then iterate based on feedback.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **UI**: Shadcn UI components built on Radix UI primitives, styled with Tailwind CSS (custom HSL color system, teal primary, coral accent).
- **Routing**: Wouter for client-side routing.
- **State Management**: React Query for server state, React Context API for authentication, local state for UI.
- **Form Management**: React Hook Form with Zod for validation.
- **Design Decisions**: Multi-step calculator, mobile-responsive, offline-first considerations.

### Backend Architecture
- **Server**: Express.js on Node.js with TypeScript.
- **API Design**: RESTful API for tax calculation CRUD operations.
- **Data Validation**: Zod schemas shared between client and server.
- **Storage Abstraction**: `IStorage` interface with `MemStorage` (in-memory) and `SupabaseStorage` implementations.
- **Design Decisions**: Monorepo structure, path aliases, middleware for logging and error handling.

### Data Storage
- **Primary Database**: Supabase (PostgreSQL-based Backend-as-a-Service).
- **Schema**: Stores tax calculations including user ID, tax year, income, deductions, and calculated results.
- **Design Decisions**: Supports authenticated and guest users, monetary values as numbers, client-side tax calculation.

### Tax Calculation Engine
- **Implementation**: Pure TypeScript functions on the client-side.
- **Tax Data**: Hard-coded SARS 2024/2025 tax year data including progressive tax brackets, age-based thresholds, rebates, and medical aid credits.

### Authentication & Authorization
- **Provider**: Supabase Auth with email/password.
- **Implementation**: `AuthContext` for global state, `ProtectedRoute` for securing routes, dedicated Login and Signup pages, Dashboard for user-specific data.
- **Security**: Row Level Security (RLS) policies in Supabase, anonymous database access removed, secure session token management.
- **User Experience**: Guest access for calculator, authentication required for saving/dashboard, clear notifications.

## External Dependencies

### Third-Party Services
- **Supabase**: Backend-as-a-Service for database, authentication, and real-time features.
- **SARB Web API**: (South African Reserve Bank) For real-time economic data (e.g., Repo Rate).

### UI & Component Libraries
- **Radix UI**: Unstyled, accessible UI primitives.
- **Shadcn UI**: Pre-built components based on Radix UI.
- **Tailwind CSS**: Utility-first CSS framework.

### Development Tools
- **Vite**: Fast build tool and development server.
- **TypeScript**: For type safety across the application.
- **ESLint**: Code linting.

### Data & State Management
- **TanStack Query**: Server state management, caching, and data synchronization.
- **React Hook Form**: Performant form management.
- **Zod**: Runtime type validation and schema definition.

### Utility Libraries
- **Wouter**: Lightweight client-side routing.
- **date-fns**: Date manipulation and formatting.
- **clsx** & **tailwind-merge**: Conditional CSS class composition.
- **class-variance-authority**: Type-safe variant-based styling.
- **cmdk**: Command palette component.
- **Lucide React**: Icon library.
- **embla-carousel-react**: Carousel/slider component.
- **next-themes**: Theme management.