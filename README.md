# Authentication System: JWT, OAuth & Roles

## Overview
This document describes how to build a complete authentication system from scratch using React + TypeScript (Vite), Node.js, Express, and MongoDB.


## Features Covered
- Email and password registration and login
- JWT access token (short-lived) plus refresh token (long-lived, httpOnly cookie)
- Refresh token rotation and silent session restore on page reload
- Logout (single device) and logout everywhere
- Google OAuth 2.0 login (redirect flow)
- Role-based access control (user, moderator, admin) on both frontend and backend
- Protected routes and role-guarded routes
- Email verification
- Forgot password and reset password
- Change password
- Axios interceptors for automatic token attach and refresh
- Security checklist and testing checklist

## Architecture

### Token Strategy
| Token | Lifetime | Stored Where | Purpose |
|-------|----------|-------------|---------|
| Access token (JWT) | 15 minutes | JavaScript memory only (never localStorage) | Sent as `Authorization: Bearer <token>` on every API call |
| Refresh token (JWT) | 7 days | httpOnly, Secure, SameSite cookie | Used only to get a new access token |

**Why this split:** An access token in memory cannot be stolen by a script that reads localStorage, and the refresh token in an httpOnly cookie cannot be read by JavaScript at all. The cost is that a page reload loses the access token, so the app calls `/auth/refresh` on startup to get a new one.

### Request Flow
1. The user logs in. The server returns `{ accessToken, user }` and sets the refresh cookie.
2. The frontend keeps the access token in a module variable and the user in React context.
3. Every request carries the access token.
4. If the server answers 401, the Axios interceptor calls `/auth/refresh` once, stores the new access token, and retries the original request.
5. If refresh fails, the user is logged out and sent to `/login`.

### OAuth Flow (Google, redirect)
1. The user clicks "Continue with Google". The browser goes to `GET /auth/google`.
2. Google authenticates the user and redirects to `GET /auth/google/callback`.
3. The server finds or creates the user, sets the refresh cookie, and redirects to `CLIENT_URL/oauth/callback`.
4. That frontend page calls `/auth/refresh` to receive the access token and user. No token ever appears in a URL.

## Project Structure
```
auth-system/
├── client/                      # React + TS (Vite)
│   └── src/
│       ├── api/
│       │   ├── axios.ts         # axios instance + interceptors
│       │   └── auth.api.ts      # auth endpoint functions
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── components/
│       │   ├── ProtectedRoute.tsx
│       │   └── RoleRoute.tsx
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── OAuthCallback.tsx
│       │   ├── ForgotPassword.tsx
│       │   ├── ResetPassword.tsx
│       │   ├── VerifyEmail.tsx
│       │   ├── Dashboard.tsx
│       │   ├── AdminPanel.tsx
│       │   └── Unauthorized.tsx
│       ├── types/auth.ts
│       ├── App.tsx
│       └── main.tsx
└── server/                      # Express + TS
    └── src/
        ├── models/User.ts
        ├── middleware/auth.ts
        ├── routes/auth.routes.ts
        ├── controllers/auth.controller.ts
        ├── utils/tokens.ts
        └── index.ts
```

## Setup

### Client
```bash
npm create vite@latest client -- --template react-ts
cd client
npm install axios react-router-dom
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### Server
```bash
mkdir server && cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv passport passport-google-oauth20 nodemailer
npm install -D typescript ts-node-dev @types/node @types/express @types/bcryptjs @types/jsonwebtoken @types/cookie-parser @types/cors @types/passport @types/passport-google-oauth20
npx tsc --init
```

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-system
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=change-me-long-random-string
REFRESH_TOKEN_SECRET=change-me-another-long-random-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SMTP_HOST=smtp.example.com
SMTP_USER=you@example.com
SMTP_PASS=your-smtp-password
```

In the Google Cloud Console, create an OAuth 2.0 Client ID (Web application) and add `GOOGLE_CALLBACK_URL` as an authorized redirect URI.

## API Contract

**Base URL:** `/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Create account, send verification email |
| POST | `/auth/login` | Public | Returns access token, sets refresh cookie |
| POST | `/auth/refresh` | Refresh cookie | Rotates refresh token, returns new access token and user |
| POST | `/auth/logout` | Refresh cookie | Revokes current refresh token, clears cookie |
| POST | `/auth/logout-all` | Access token | Revokes all refresh tokens for the user |
| GET | `/auth/me` | Access token | Returns current user |
| GET | `/auth/verify-email/:token` | Public | Marks email as verified |
| POST | `/auth/forgot-password` | Public | Sends reset email |
| POST | `/auth/reset-password/:token` | Public | Sets new password |
| POST | `/auth/change-password` | Access token | Changes password while logged in |
| GET | `/auth/google` | Public | Starts Google OAuth |
| GET | `/auth/google/callback` | Public | Google redirects here |
| GET | `/admin/users` | Access token, admin | Example admin-only route |

**Standard error shape:** `{ "message": "Invalid email or password" }`

## Backend Implementation

### 6.1 User Model (models/User.ts)
See the provided user schema with role enum, verification status, Google ID, and refresh token hashing.

### 6.2 Token Helpers (utils/tokens.ts)
JWT signing, verification, hashing, and cookie management utilities.

### 6.3 Auth and Role Middleware (middleware/auth.ts)
`authenticate` - verifies Bearer token from Authorization header
`authorize` - role-based access control

### 6.4 Controller (controllers/auth.controller.ts)
All authentication endpoints: register, login, refresh, logout, logout-all, me, verifyEmail, forgotPassword, resetPassword, changePassword.

### 6.5 Google OAuth (Passport) and routes (routes/auth.routes.ts)
Passport GoogleStrategy setup and all auth routes.

### 6.6 Server Entry (index.ts)
Express app setup with CORS, cookie parser, Passport initialization, and example admin route.

## Security Checklist
- Passwords hashed with bcrypt (cost 12). Never log or return them.
- Access token in memory only. Refresh token in an httpOnly, Secure, SameSite cookie.
- Refresh token rotation with reuse detection. Only hashes of refresh tokens are stored.
- Reset and verification tokens are random and hashed in the database, and reset tokens expire in 15 minutes.
- Login and forgot-password responses do not reveal whether an email exists.
- CORS limited to the client origin with `credentials: true`.
- HTTPS in production (required for the Secure cookie).
- Rate limiting on login, register, and forgot-password.
- Use helmet for security headers.
- Use separate long random secrets for the access and refresh tokens, kept only in environment variables.
- Keep `sameSite: "lax"` or `"strict"` on the refresh cookie and scope its path to `/api/auth` so it is not sent with other requests.
- Validate request bodies (for example with zod) before using them.

## Testing Checklist
1. Register, then confirm the verification email arrives and the link works.
2. Login with correct and wrong credentials.
3. Reload the page while logged in. The session should restore without a login screen.
4. Wait for the access token to expire (set it to 10 seconds while testing). The next request should refresh silently and succeed.
5. Fire several requests at once with an expired token. Only one `/auth/refresh` call should happen.
6. Manually reuse an old refresh token. All sessions should be revoked.
7. Logout, then press back. Protected pages should redirect to login.
8. Visit `/admin` as a normal user. You should land on `/unauthorized`. Call `/api/admin/users` directly with a user token and expect 403.
9. Google login with a new email, and with an email that already has a password account.
10. Forgot password, reset password, then confirm old sessions no longer refresh.
11. Change password with a wrong current password.

## Suggested Build Order and Commits
1. `chore: scaffold client and server projects`
2. `feat(server): add user model and token utilities`
3. `feat(server): add register and login endpoints`
4. `feat(server): add refresh rotation, logout and auth middleware`
5. `feat(client): add axios instance with refresh interceptor`
6. `feat(client): add AuthContext and session restore`
7. `feat(client): add login and register pages`
8. `feat(client): add protected and role routes`
9. `feat(server): add role authorization and admin route`
10. `feat: add google oauth login`
11. `feat: add email verification and password reset`
12. `feat: add change password and logout-all`
13. `chore: add rate limiting, helmet and request validation`

## Possible Extensions
- GitHub OAuth (same pattern as Google, with passport-github2)
- Two-factor authentication (TOTP)
- Permission-based access on top of roles
- Active sessions list with device names and per-device logout
- Account lockout after repeated failed logins
- React Hook Form with zod validation for the forms