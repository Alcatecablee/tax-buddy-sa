# SARS eFiling Assistant

## Overview

The SARS eFiling Assistant is a modern web application designed to simplify tax filing for South African taxpayers. It provides an intelligent, user-friendly alternative to the traditional SARS eFiling platform by offering pre-filled forms, real-time refund estimates, plain language explanations, and offline capabilities. The application addresses common pain points such as long wait times, confusing interfaces, technical errors, and security concerns.

The system enables users to calculate their tax liability based on official SARS 2024/2025 tax brackets, save calculations for future reference, and access their filing history through a personalized dashboard.

## Recent Changes

**November 13, 2025** - Backend Integration & Offline Mode Implementation
- **CRITICAL FIX**: Registered API routes in server/index.ts (routes were defined but never connected to Express)
- Initialized SupabaseStorage backend with proper error handling and fallback to MemStorage
- Implemented comprehensive error handling in backend routes with detailed error messages
- Added Zod validation error details in API responses for better debugging
- Created offline storage system with localStorage fallback for when backend is unavailable
- Implemented automatic sync when connection is restored
- Added useCalculations hook for unified data access with offline support
- All frontend data operations now go through Express API (consistent schema mapping)
- Export to PDF and CSV functionality fully implemented and working
- Improved backend initialization with clear logging of storage backend selection
- Server now properly handles Supabase credentials and provides clear feedback on configuration issues

**November 12, 2025** - Authentication & Dashboard Implementation
- Implemented complete Supabase authentication system with email/password signup and login
- Added AuthContext for managing user sessions across the application
- Created ProtectedRoute component for securing routes that require authentication
- Built Login and Signup pages with form validation and error handling
- Implemented Dashboard page displaying user's saved tax calculations with delete functionality
- Updated Calculator to require authentication for saving calculations (shows "Sign In to Save" button for unauthenticated users)
- Enhanced error handling in authentication flows with proper loading states
- Improved React patterns with useEffect-based redirects in auth pages
- Created migration to remove anonymous database access for security
- Fixed LSP diagnostics by adding proper server TypeScript configuration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server.

**UI Component Library**: Shadcn UI components built on Radix UI primitives, providing accessible, customizable components with Tailwind CSS styling.

**Routing**: Wouter for client-side routing, offering a lightweight alternative to React Router.

**State Management**: 
- React Query (TanStack Query) for server state management, data fetching, and caching
- React Context API for authentication state via AuthContext
- Local component state for form inputs and UI interactions

**Styling**: Tailwind CSS with custom design tokens defined in CSS variables (HSL color system), featuring a professional teal primary color, coral accent for CTAs, and success green for refunds.

**Form Management**: React Hook Form with Zod for schema validation, providing type-safe form handling.

**Key Design Decisions**:
- Multi-step calculator interface with progress tracking for improved user experience
- Offline-first considerations mentioned in marketing copy (though implementation details not visible in current codebase)
- Mobile-responsive design with custom breakpoints

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Development/Production Setup**: 
- Development: Vite dev server running in middleware mode with HMR support
- Production: Static file serving from built client assets
- Single server entry point (`server/index.ts`) handles both API routes and client serving

**API Design**: RESTful API with endpoints for tax calculation CRUD operations:
- `GET /api/calculations` - Retrieve all calculations (optionally filtered by userId)
- `GET /api/calculations/:id` - Retrieve single calculation
- `POST /api/calculations` - Create new calculation
- `PUT /api/calculations/:id` - Update existing calculation
- `DELETE /api/calculations/:id` - Delete calculation

**Data Validation**: Zod schemas shared between client and server via the `@shared` directory, ensuring type safety and consistency.

**Storage Abstraction**: `IStorage` interface with two implementations:
- `MemStorage`: In-memory storage for development/testing
- `SupabaseStorage`: Production-ready storage using Supabase
- This abstraction allows easy switching between storage backends

**Key Design Decisions**:
- Monorepo structure with shared types/schemas between client and server
- Path aliases (`@/`, `@shared/`, `@assets/`) for clean imports
- Middleware-based request logging with duration tracking
- Error handling middleware for consistent error responses

### Data Storage

**Primary Database**: Supabase (PostgreSQL-based Backend-as-a-Service)

**Schema**: Tax calculations with the following structure:
- User identification (userId, optional/nullable for guest calculations)
- Tax year and age category
- Income sources (salary, freelance, rental, investment)
- Deductions (retirement, medical aid, medical expenses, charitable donations)
- Tax paid (PAYE, provisional tax)
- Calculated results (total income, taxable income, tax owed, refund amount)
- Timestamps (createdAt, updatedAt)

**Key Design Decisions**:
- Support for both authenticated and guest users (nullable userId)
- All monetary values stored as numbers (likely representing cents or rands)
- Calculations are immutable once created (updates supported but audit trail not visible)
- Client-side tax calculation engine based on official SARS 2024/2025 brackets

### Tax Calculation Engine

**Implementation**: Pure TypeScript functions in `client/src/lib/taxCalculator.ts`

**Tax Data**: Hard-coded SARS 2024/2025 tax year data:
- Seven progressive tax brackets with rates from 18% to 45%
- Age-based tax thresholds and rebates (under 65, 65-74, 75+)
- Medical aid tax credits
- Retirement contribution limits (27.5% of income)

**Key Design Decisions**:
- All tax calculations performed client-side for instant feedback
- Results stored server-side for historical tracking
- Separate calculation of gross income, taxable income, tax owed, and refund amount

### Authentication & Authorization

**Provider**: Supabase Auth with email/password authentication

**Implementation**: 
- **AuthContext** (`client/src/contexts/AuthContext.tsx`): Global authentication state management using React Context
  - Provides user session state, loading state, and auth methods (signUp, signIn, signOut)
  - Automatic session restoration on application load
  - Error handling for session fetch failures
  - Subscription to auth state changes for real-time session updates
- **ProtectedRoute** (`client/src/components/ProtectedRoute.tsx`): HOC for securing routes
  - Shows loading state while checking authentication
  - Redirects unauthenticated users to login page
  - Preserves intended destination for post-login redirect
- **Login Page** (`client/src/pages/Login.tsx`): User sign-in interface
  - Email and password validation
  - Error messaging for failed login attempts
  - Link to signup page for new users
  - useEffect-based redirect for already-authenticated users
- **Signup Page** (`client/src/pages/Signup.tsx`): User registration interface
  - Email and password validation with confirmation
  - Password strength requirements (minimum 6 characters)
  - Error messaging for registration failures
  - Link to login page for existing users
  - useEffect-based redirect for already-authenticated users
- **Dashboard** (`client/src/pages/Dashboard.tsx`): Protected user area
  - Displays authenticated user's saved tax calculations
  - Delete functionality for removing calculations
  - Date formatting for creation timestamps
  - Empty state messaging when no calculations exist

**Security**:
- Row Level Security (RLS) policies enforced at database level
- Authenticated users can only access their own calculations (user_id scoped)
- Anonymous database access removed for production security
- Session tokens managed securely by Supabase SDK
- Password handling delegated to Supabase Auth (no plain text storage)

**User Experience**:
- Guest access allowed for calculator functionality (unauthenticated users can use calculator)
- Authentication required only for saving calculations and accessing dashboard
- Calculator shows "Sign In to Save" button for unauthenticated users
- Clear toast notifications for auth errors and successes
- Seamless session restoration on page reload

## External Dependencies

### Third-Party Services

**Supabase** (`@supabase/supabase-js`)
- Purpose: Backend-as-a-Service providing PostgreSQL database, authentication, and real-time subscriptions
- Configuration: Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables
- Usage: User authentication, tax calculation persistence, and potential real-time features

### UI & Component Libraries

**Radix UI** (Multiple packages: `@radix-ui/react-*`)
- Purpose: Unstyled, accessible UI primitives
- Components: Dialog, Dropdown, Accordion, Toast, Tooltip, Radio Group, Progress, and more
- Rationale: Provides accessibility out-of-the-box while allowing full styling control

**Shadcn UI** (Configuration-based)
- Purpose: Pre-built component library built on Radix UI
- Configuration: `components.json` defines style, path aliases, and Tailwind integration
- Components: Located in `client/src/components/ui/`

**Tailwind CSS**
- Purpose: Utility-first CSS framework
- Configuration: Custom color system with HSL values, custom shadows, gradients
- Integration: PostCSS plugin with autoprefixer

### Development Tools

**Vite**
- Purpose: Fast build tool and development server
- Features: Hot Module Replacement (HMR), React Fast Refresh, TypeScript support
- Configuration: Custom middleware mode for Express integration

**TypeScript**
- Purpose: Type safety across client and server
- Configuration: Separate tsconfig files for app, server, and Node environments
- Strictness: Intentionally relaxed (`strict: false`) for faster development

**ESLint**
- Purpose: Code linting with TypeScript and React support
- Plugins: React Hooks, React Refresh
- Configuration: Unused variables rule disabled

### Data & State Management

**TanStack Query** (`@tanstack/react-query`)
- Purpose: Server state management, caching, and data synchronization
- Configuration: 5-minute stale time, no refetch on window focus

**React Hook Form** (`react-hook-form`)
- Purpose: Performant form management with minimal re-renders

**Zod** (via `@hookform/resolvers`)
- Purpose: Runtime type validation and schema definition
- Integration: Shared schemas between client and server

### Utility Libraries

**Wouter**
- Purpose: Lightweight client-side routing (alternative to React Router)

**date-fns**
- Purpose: Date manipulation and formatting

**clsx** & **tailwind-merge**
- Purpose: Conditional CSS class composition with Tailwind conflict resolution

**class-variance-authority**
- Purpose: Type-safe variant-based styling for components

**cmdk**
- Purpose: Command palette/menu component

**Lucide React**
- Purpose: Icon library with React components

**embla-carousel-react**
- Purpose: Carousel/slider component

**next-themes**
- Purpose: Theme management (dark/light mode support)