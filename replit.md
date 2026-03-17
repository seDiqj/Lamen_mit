# Lamen Microfinance Institution - Loan Management System

## Overview

This is a full-stack loan management system for Lamen Microfinance Institution. The application provides comprehensive loan lifecycle management including customer registration, loan applications, approvals, disbursements, payment tracking, and reporting. It features role-based access control with three user levels (user, manager, admin) and integrates with Replit Auth for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Charts**: Recharts for data visualization on dashboard and reports
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Management**: express-session with PostgreSQL session store (connect-pg-simple)
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Data Storage
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` - Contains all table definitions using Drizzle ORM
- **Key Tables**:
  - `users`, `sessions` - Authentication (required by Replit Auth)
  - `userRoles` - Role-based access control
  - `rolePagePermissions` - Default page permissions per role (auto-applied on user creation/role change)
  - `branches`, `financeOfficers` - Organization structure
  - `customers`, `customerBusinesses`, `businessLicenses` - Customer data
  - `financingPurposes` - Lookup table for financing purpose dropdown values
  - `collateralTypes` - Lookup table for collateral type dropdown values
  - `productCycleLimits` - Unlimited cycle-based min/max amount limits per financing product
  - `loans`, `collaterals`, `guarantors` - Loan information (loans includes `businessDetailedDescription`, `clientOccupation` fields; collaterals includes `description`, `district` fields)
  - `loanApprovals`, `disbursements`, `installments` - Loan lifecycle
  - `activityLogs` - Audit trail
  - `accounts` - Chart of accounts with hierarchical structure for double-entry bookkeeping
  - `journalEntries`, `journalLines` - Double-entry transactions with posting/reversal support
  - `fiscalPeriods` - Accounting period management

### Accounting Module
- **Double-Entry Bookkeeping**: Full support for double-entry with strict validation (debits must equal credits)
- **Chart of Accounts**: Hierarchical account structure with 5 types (asset, liability, equity, income, expense)
- **Journal Entries**: Create, post, and reverse journal entries with proper audit trail
- **Financial Reports**: Trial Balance, Income Statement, Balance Sheet, Account Statement
- **Server-Side Validation**: Enforces minimum 2 lines, no negative amounts, balanced entries
- **Role Restrictions**: Financial reports restricted to manager and admin roles

### Authentication & Authorization
- **Authentication**: Replit Auth integration via OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Authorization**: Role-based access control with two layers:
  - `user_roles.role` (varchar) stores the specific role value (e.g., "cfo", "finance_officer", "admin")
  - `lookup_roles` table defines each role with a `role_type` (user/manager/admin) for access level
  - `hasRole()` checks both the direct role value AND the roleType from lookup_roles
  - Frontend uses roleType for menu visibility and page access decisions
- **Role Types**: Three access levels - User (basic page permissions), Managerial (full page access), Admin (full system + user management)
- **Activity Logging**: All significant actions are logged with user ID, IP address, and timestamps

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production Build**: 
  - Frontend: Vite builds to `dist/public`
  - Backend: esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and query client
│   └── pages/           # Route pages
├── server/              # Express backend
│   ├── replit_integrations/auth/  # Replit Auth setup
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Database operations
├── shared/              # Shared code between frontend/backend
│   ├── schema.ts        # Drizzle database schema
│   └── models/          # Type definitions
└── migrations/          # Drizzle migration files
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Required Environment Variables**:
  - `ISSUER_URL` - Replit OIDC issuer (defaults to https://replit.com/oidc)
  - `SESSION_SECRET` - Secret for session encryption
  - `REPL_ID` - Replit environment identifier

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Recharts**: Chart library for data visualization
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Backend bundler for production
- **TypeScript**: Type checking across the stack
- **Drizzle Kit**: Database migration tooling