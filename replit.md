# Nomad Internet Customer Portal

## Overview
A customer portal for Nomad Internet customers with sign-in and sign-up functionality. The portal uses official Nomad Internet branding with a modern SaaS-style design. Features full authentication with OTP verification, PostgreSQL database for customer storage, and activity tracking.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Auth**: JWT-based sessions with bcrypt password hashing

## Design System
- **Primary Color**: #10a37f (brand green)
- **Accent Color**: #0a8f6a (deep green)
- **Background**: #f7faf9 (light mint)
- **Text**: #0f172a (slate-900)
- **Muted**: #64748b (slate-500)
- **Font**: Inter (system fonts fallback)
- **Logo**: Nomad Internet official logo

### Key Design Elements
- Glassmorphism card with backdrop blur
- Gradient left panel with layered radial gradients
- 34px bold titles (800 weight)
- 52px tall inputs with subtle focus rings
- 54px gradient buttons with shadows
- Stats section with border-top styling

## Project Structure
```
src/
├── components/
│   ├── AuthLayout.tsx    # Two-column layout with glassmorphism card
│   ├── Button.tsx        # Gradient button with hover animations
│   └── Input.tsx         # Tall styled input with tooltips
├── pages/
│   ├── SignIn.tsx        # Sign-in page (password or OTP)
│   ├── SignUp.tsx        # Multi-step sign-up flow
│   └── Dashboard.tsx     # User dashboard with account info
├── App.tsx               # Router configuration
├── main.tsx              # App entry point
└── index.css             # Global styles + design tokens

server/
├── index.ts              # Express API endpoints
├── storage.ts            # Database storage layer
└── db.ts                 # Drizzle database connection

shared/
└── schema.ts             # Database schema (customers, otp_codes, sessions)
```

## Database Schema
- **customers**: email, phone, password hash, verification status, Chargebee ID, login tracking
- **otp_codes**: 6-digit codes with 10-minute expiration, types (phone/email/signin)
- **sessions**: JWT tokens with 7-day expiration

## Sign-Up Flow
1. **Email Step**: User enters email, verified against Chargebee API
2. **Confirm Email**: If not found in Chargebee, asks user to confirm or try different email
3. **Phone Step**: Collects US phone number (+1 format with validation)
4. **Phone OTP**: Backend generates 6-digit OTP, sends via Twilio, user enters code
5. **Email OTP**: Backend generates 6-digit OTP, sends via Twilio, user enters code
6. **Password**: User creates password (min 8 characters)
7. **Auto-login**: User is automatically logged in and redirected to dashboard

## Sign-In Methods
1. **Password**: Traditional email + password authentication
2. **OTP (Passwordless)**: Email OTP sent, verified, then logged in

## Backend API Endpoints
- `POST /api/auth/check-email` - Verify email against Chargebee
- `POST /api/auth/send-phone-otp` - Generate and send phone OTP
- `POST /api/auth/verify-phone-otp` - Verify phone OTP code
- `POST /api/auth/send-email-otp` - Generate and send email OTP
- `POST /api/auth/verify-email-only` - Verify email OTP (sign-up)
- `POST /api/auth/complete-signup` - Set password and complete registration
- `POST /api/auth/signin` - Password-based sign in
- `POST /api/auth/signin-otp` - Request OTP for sign in
- `POST /api/auth/verify-signin-otp` - Verify OTP and sign in
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Invalidate session

## External API Endpoints
- `POST https://app.lrlos.com/webhook/Chargebee/getcustomersusingemail` - Customer lookup
- `POST https://app.lrlos.com/webhook/twilio/sendotp` - Send OTP codes

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `JWT_SECRET` - Secret key for JWT token signing (required)

## Running the App
```bash
npm run dev      # Frontend on port 5000
npm run server   # Backend on port 3001
npm run db:push  # Push database schema
```

## Recent Changes
- Jan 24, 2026: Full authentication implementation
  - PostgreSQL database with customers, OTP codes, and sessions tables
  - Express backend with OTP generation, verification, and auth endpoints
  - Sign-up flow with phone and email OTP verification
  - Sign-in with password or OTP-based authentication
  - Dashboard with account info and activity tracking (last login, login count)
  - JWT-based session management with 7-day tokens
  - Secure email OTP verification before password creation
