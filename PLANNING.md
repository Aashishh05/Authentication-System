# Authentication System - Phase Planning

## Overview
Building a complete JWT, OAuth & Role-based authentication system from scratch. This will be developed in **13 small, incremental commits** so each step works independently.

---

## Phase 1: Project scaffolding
**Goal:** Set up both client and server projects with basic configuration.

### Tasks:
1. **Create Vite React + TypeScript project**
   - `npm create vite@latest client -- --template react-ts`
   - Install: `axios`, `react-router-dom`
   - Set up `client/.env` with `VITE_API_URL`

2. **Create Node.js + TypeScript + Express project**
   - `mkdir server && cd server`
   - `npm init -y`
   - Install dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `cors`, `dotenv`, `passport`, `passport-google-oauth20`, `nodemailer`
   - Dev dependencies: `typescript`, `ts-node-dev`, `@types/node`, `@types/express`, `@types/bcryptjs`, `@types/jsonwebtoken`, `@types/cookie-parser`, `@types/cors`, `@types/passport`, `@types/passport-google-oauth20`
   - Initialize TS config: `npx tsc --init`
   - Set up `server/.env` with all required environment variables
   - Create Google OAuth 2.0 Client ID in Google Cloud Console

3. **Create directory structure**
   - `client/src/{api,context,components/pages,types}`
   - `server/src/{models,middleware,routes,controllers,utils}`

**Deliverable:** Both projects run independently (`npm run dev` on both).

---

## Phase 2: Backend - User model and token utilities
**Goal:** Define the User schema and JWT helper functions.


### Tasks:
1. **Create User model** (`server/src/models/User.ts`)
   - Fields: name, email, password (hashed), role enum [user/moderator/admin], isVerified, googleId, avatar
   - Refresh tokens stored as SHA-256 hashes (for rotation/security)
   - verifyToken, resetToken, resetTokenExpires fields
   - Timestamps enabled

2. **Create token utilities** (`server/src/utils/tokens.ts`)
   - `signAccessToken(payload)` - JWT with 15min expiry
   - `signRefreshToken(payload)` - JWT with 7day expiry
   - `verifyRefreshToken(token)` - verify and return payload
   - `hashToken(token)` - SHA-256 hash for database storage
   - `setRefreshCookie(res, token)` - cookie with httpOnly, Secure, SameSite
   - `clearRefreshCookie(res)` - clear the cookie

3. **Create nodemailer utility** (`server/src/utils/email.ts`)
   - Simple wrapper to send email with verification/reset links

**Deliverable:** User can register a new account with hashed password.

---

## Phase 3: Backend - Register and Login endpoints
**Goal:** Implement authentication endpoints.

### Tasks:
1. **Register controller** (`server/src/controllers/auth.controller.ts`)
   - Validate name, email, password (8+ chars)
   - Check email not already in use (409 conflict)
   - Hash password with bcrypt (cost 12)
   - Create verification token (random 32-byte hex)
   - Save user with verifyToken
   - Send verification email via nodemailer
   - Respond: "Registered. Check your email to verify your account."

2. **Login controller** (`server/src/controllers/auth.controller.ts`)
   - Find user by email
   - Compare password with bcrypt
   - If invalid: return 401 "Invalid email or password"
   - Issue access token + refresh token (via `issueTokens` helper)
   - Set refresh cookie
   - Respond: `{ accessToken, user: publicUser(user) }`

3. **Routes** (`server/src/routes/auth.routes.ts`)
   - POST `/register` → register controller
   - POST `/login` → login controller

**Deliverable:** Working register and login APIs.

---

## Phase 4: Backend - Refresh rotation, logout & auth middleware
**Goal:** Token rotation, logout, and request protection.

### Tasks:
1. **Refresh controller** (`server/src/controllers/auth.controller.ts`)
   - Read refresh token from cookie
   - If no cookie: 401 "No refresh token"
   - Verify refresh token JWT
   - Find user by ID, include refreshTokens
   - **Rotation:** Hash the incoming token, check against stored hashes
     - If hash NOT found → reuse detected → clear all refresh tokens, clear cookie, 401 "Refresh token reuse detected"
     - If hash found → remove old hash from array, issue new tokens, return new access token + user
   - If verification fails: clear cookie, 401 "Invalid refresh token"

2. **Logout controller**
   - Remove current refresh token hash from user's array
   - Clear refresh cookie
   - Respond: "Logged out"

3. **Logout-all controller**
   - Clear user's refreshTokens array
   - Clear refresh cookie
   - Respond: "Logged out from all devices"

4. **Auth middleware** (`server/src/middleware/auth.ts`)
   - `authenticate` - verify Bearer token from Authorization header
   - `authorize` - role-based guard (`admin`, `moderator`, etc.)

5. **Me endpoint**
   - GET `/auth/me` - return current user from token

6. **Routes updates**
   - POST `/refresh` → refresh controller
   - POST `/logout` → logout controller
   - POST `/logout-all` → logout-all controller (auth middleware)
   - GET `/me` → me controller (auth middleware)

**Deliverable:** Refresh token rotation works, logout clears cookie, protected routes require valid token.

---

## Phase 5: Frontend - Axios instance with interceptors
**Goal:** Automatic token attachment and silent refresh.

### Tasks:
1. **Create Axios instance** (`client/src/api/axios.ts`)
   - Base URL from `VITE_API_URL`
   - `withCredentials: true` (send refresh cookie)
   - Module-level `accessToken` variable
   - `setAccessToken(token)` function to update the module variable

2. **Implement refresh logic**
   - `refreshAccessToken()` - POST to `/auth/refresh` with credentials
   - `refreshPromise` - debounce so only one refresh happens at a time
   - On 401 response: try refresh, retry original request

3. **Skip refresh list**
   - URLs that shouldn't trigger refresh: `/auth/login`, `/auth/register`, `/auth/refresh`

4. **Response interceptor**
   - On 401: set `original._retry = true`, call refresh, retry with new token
   - If refresh fails: dispatch `auth:logout` event, clear token

**Deliverable:** API calls automatically attach access token, refresh silently on 401.

---

## Phase 6: Frontend - AuthContext and session restore
**Goal:** Global state management with React Context.

### Tasks:
1. **Create types** (`client/src/types/auth.ts`)
   - `Role` type: "user" | "moderator" | "admin"
   - `User` interface with id, name, email, role, isVerified, avatar
   - `AuthResponse` with accessToken + user
   - `LoginPayload`, `RegisterPayload`
   - `AuthContextType` with all methods

2. **Create AuthProvider** (`client/src/context/AuthContext.tsx`)
   - State: `user`, `isLoading`
   - `restoreSession()` - on startup/reload: call `/auth/refresh`, set access token, set user
   - Effect on mount: `restoreSession()`
   - Effect: listen for `auth:logout` event to force logout
   - `login(payload)` - login API, set token + user
   - `register(payload)` - register API, return message
   - `logout()` - call API + clear token + user
   - `hasRole(...roles)` - check if user has any of the given roles

3. **Provider wrapping**
   - `App.tsx` wraps everything in `<AuthProvider>`

**Deliverable:** Session restores on page reload, role checking available anywhere.

---

## Phase 7: Frontend - Login and Register pages
**Goal:** Authentication UI pages.

### Tasks:
1. **Login page** (`client/src/pages/Login.tsx`)
   - Form: email, password
   - Google OAuth button: redirects to `/auth/google`
   - On submit: call `login()`, navigate to dashboard (or `from` state)
   - Show error if login fails
   - Links: forgot password, create account

2. **Register page** (`client/src/pages/Register.tsx`)
   - Form: name, email, password (8+ chars)
   - On submit: call `register()`, show message
   - Link: already have an account? → login

**Deliverable:** Users can register and login through UI.

---

## Phase 8: Frontend - Protected and Role routes
**Goal:** Route-level access control.

### Tasks:
1. **ProtectedRoute** (`client/src/components/ProtectedRoute.tsx`)
   - Check `isAuthenticated` from auth context
   - If loading: show "Loading..."
   - If not authenticated: `<Navigate to="/login" state={{ from: location }} replace />`
   - If authenticated: render `<Outlet />` (or children)

2. **RoleRoute** (`client/src/components/RoleRoute.tsx`)
   - Prop: `allowed` array of roles ["admin"], ["user", "moderator"]
   - Check `hasRole(...allowed)` from auth context
   - If authorized: render `<Outlet />`
   - If not: `<Navigate to="/unauthorized" replace />`

3. **Unauthorized page** (`client/src/pages/Unauthorized.tsx`)
   - "403, you don't have access" message
   - Link back to dashboard

**Deliverable:** Routes guard based on authentication and roles.

---

## Phase 9: Backend - Role authorization & admin route
**Goal:** Server-side role protection.

### Tasks:
1. **Role middleware** - already created in Phase 4 (`authorize("admin")`, etc.)

2. **Admin route** (`server/src/index.ts`)
   - GET `/api/admin/users` - requires `authenticate` + `authorize("admin")`
   - Returns list of users (name, email, role, isVerified)

3. **Test** - verify normal user gets 403 on admin endpoint

**Deliverable:** Role-based access control on backend.

---

## Phase 10: Google OAuth login
**Goal:** Google "Continue with Google" flow.

### Tasks:
1. **Passport GoogleStrategy** (`server/src/routes/auth.routes.ts`)
   - Configure with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
   - Verify callback: find or create user from Google profile
   - If new user: create with name, email, googleId, isVerified=true
   - If existing user without googleId: link Google account
   - Set refresh cookie
   - Redirect to `/oauth/callback` on frontend

2. **OAuth callback page** (`client/src/pages/OAuthCallback.tsx`)
   - On mount: call `restoreSession()` from auth context
   - After restore: navigate to `/dashboard` if authenticated, or `/login?error=oauth` if not

3. **Google login button** (`client/src/pages/Login.tsx`)
   - Redirect to `/auth/google`

**Deliverable:** Users can login with Google account.

---

## Phase 11: Email verification and password reset
**Goal:** Account recovery and email verification.

### Tasks:
1. **Verify email endpoint** - already in controller
   - GET `/auth/verify-email/:token` - mark user as verified
   - Frontend page: `VerifyEmail.tsx` shows status

2. **Forgot password** (`server/src/controllers/auth.controller.ts`)
   - POST `/auth/forgot-password` - send reset email
   - Respond generically: "If that email exists, a reset link has been sent." (prevents enumeration)

3. **Reset password** (`server/src/controllers/auth.controller.ts`)
   - POST `/auth/reset-password/:token` - set new password after verification
   - Clear refreshTokens (sign out everywhere) on password change

4. **Frontend pages**
   - `ForgotPassword.tsx` - form with email input
   - `ResetPassword.tsx` - form with new password (two times)
   - `VerifyEmail.tsx` - shows verification status

**Deliverable:** Users can verify email and reset password.

---

## Phase 12: Change password and logout-all
**Goal:** Account security features.

### Tasks:
1. **Change password** (`server/src/controllers/auth.controller.ts`)
   - POST `/auth/change-password` (auth middleware required)
   - Verify current password with bcrypt
   - Hash new password, save, respond "Password changed"

2. **Frontend** - add change password form to Dashboard or settings

3. **Logout-all** already implemented in Phase 4

**Deliverable:** Users can change password and logout from all devices.

---

## Phase 13: Polish, security, and testing
**Goal:** Harden the application and verify everything works.

### Tasks:
1. **Rate limiting** - `express-rate-limit` on `/login`, `/register`, `/forgot-password`

2. **Helmet middleware** - security headers

3. **Request validation** - consider adding zod for body validation

4. **Testing checklist** (from README):
   - Register + verify email
   - Login with correct/wrong credentials
   - Page reload session restore
   - Access token expiration + silent refresh
   - Concurrent requests with expired token (only one refresh)
   - Manual refresh token reuse (all sessions revoked)
   - Logout + back button protection
   - Admin route 403 for normal users
   - Google login new vs existing email
   - Forgot → reset → old sessions invalidated
   - Change password with wrong current password

5. **Build order verification** - follow the 13 commits

**Deliverable:** Production-ready authentication system with all security checks.

---

## Quick Reference: Token Strategy

| Token | Lifetime | Storage | Key Security |
|-------|----------|---------|-------------|
| Access | 15 min | JS memory | Never localStorage; sent as Bearer header |
| Refresh | 7 days | httpOnly cookie | Can't be read by JS; rotation + reuse detection |

## Key Principles
- **Never trust the client** - always check roles on server
- **Role changes take effect** when next access token is issued (within 15 min)
- **New users are always "user"** role - never set admin from client
- **Refresh token in cookie** cannot be read by JavaScript (httpOnly)
- **Session restore on reload** calls `/auth/refresh` to get new access token
- **Error messages are generic** - don't reveal if email exists