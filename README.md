# Full-Stack Authentication System

A complete authentication system built with **Express.js** backend and **React + TypeScript** frontend, featuring JWT authentication, bcrypt password hashing, and Role-Based Access Control (RBAC).

---

## Tech Stack

### Backend
- **Express.js** — REST API framework
- **Prisma** — ORM for database management
- **SQLite** — lightweight database
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT creation and verification
- **dotenv** — environment variable management
- **TypeScript** — type safety

### Frontend
- **React + TypeScript** — UI framework
- **Vite** — build tool
- **React Router** — client-side routing
- **Zustand** — global auth state management
- **Axios** — HTTP requests with interceptors
- **React Query** — mutation handling
- **Zod** — form validation
- **jwt-decode** — decode JWT on the client

---

## Project Structure

### Backend
```
auth-api/
  prisma/
    schema.prisma       ← database schema
    migrations/         ← migration history
  src/
    prisma/
      client.ts         ← Prisma client instance
    routes/
      auth.ts           ← register, login, profile, admin routes
    middleware/
      auth.ts           ← authenticate + authorize middleware
    index.ts            ← Express app entry point
  .env                  ← environment variables
```

### Frontend
```
auth-frontend/
  src/
    api/
      axios.ts          ← axios instance + interceptors
      auth.ts           ← login, register API functions
    store/
      authStore.ts      ← Zustand auth store
    pages/
      Login.tsx         ← login page
      Dashboard.tsx     ← protected page
      Admin.tsx         ← admin only page
    components/
      ProtectedRoute.tsx ← redirects if not authenticated
      AdminRoute.tsx     ← redirects if not admin
    schemas/
      authSchema.ts     ← Zod validation schemas
    types/
      index.ts          ← TypeScript types
    main.tsx            ← app entry + restore auth from localStorage
    App.tsx             ← route definitions
```

---

## How It Works

### 1. Password Hashing with bcrypt

When a user registers, their password is never stored in plain text. bcrypt hashes it with a salt:

```ts
const hashedPassword = await bcrypt.hash(password, 10)
// "hello123" → "$2b$10$Xk9mZ..."
```

The `10` is the number of salt rounds — bcrypt runs the hashing algorithm 2^10 = 1024 times, making brute force attacks slow.

When a user logs in, bcrypt compares the plain password with the stored hash:

```ts
const isMatch = await bcrypt.compare(password, existingUser.password)
// true if match, false if not
```

The original password is never stored — only the hash.

---

### 2. JWT Authentication

On successful login, the server creates a JWT token:

```ts
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },  // payload
  process.env.JWT_SECRET,                                // secret key
  { expiresIn: "7d" }                                    // expires in 7 days
)
```

A JWT has 3 parts separated by dots:
```
header.payload.signature

header    → algorithm used (HS256)
payload   → { id, email, role, iat, exp } — base64 encoded, readable but not encrypted
signature → proves the token came from our server, signed with JWT_SECRET
```

The client stores the token in `localStorage` and sends it in every request:
```
Authorization: Bearer eyJhbGc...
```

The server verifies the token on every protected request:
```ts
const decoded = jwt.verify(token, process.env.JWT_SECRET)
// valid → returns payload { id, email, role }
// invalid/expired → throws error → 401 Unauthorized
```

**Why JWT?**
- Stateless — server doesn't store sessions
- The token carries all identity information
- Can't be forged without knowing `JWT_SECRET`

---

### 3. Auth Middleware

Two middleware functions protect routes:

**`authenticate`** — verifies the JWT:
```ts
export function authenticate(req, res, next) {
  // 1. extract token from Authorization header
  // 2. jwt.verify(token, secret)
  // 3. attach decoded user to req.user
  // 4. call next() to proceed to route handler
  // if invalid → return 401
}
```

**`authorize`** — checks user role:
```ts
export function authorize(...roles: string[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
}
```

Usage on routes:
```ts
// any logged in user
router.get("/profile", authenticate, handler)

// admin only
router.get("/admin", authenticate, authorize("admin"), handler)
```

---

### 4. RBAC — Role Based Access Control

Every user has a `role` field in the database — `"user"` or `"admin"`.

The role is embedded in the JWT payload on login. When a request hits a protected route, the middleware checks the role and either allows or denies access:

```
role = "user"  → GET /profile ✅  GET /admin ❌ (403)
role = "admin" → GET /profile ✅  GET /admin ✅
```

---

### 5. Frontend Auth Flow

**Axios interceptors** handle token management automatically:

```ts
// request interceptor — adds token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// response interceptor — handles expired tokens globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
```

**Zustand auth store** holds the current user and token:
```ts
// on login
setAuth(token) → decode token with jwt-decode → save to store + localStorage

// on logout
logout() → clear store + remove from localStorage
```

**Token persistence on refresh** — restores auth state from localStorage before the app renders:
```ts
// main.tsx
const token = localStorage.getItem("token")
if (token) useAuthStore.getState().setAuth(token)
```

**Protected routes** redirect unauthenticated users:
```tsx
// ProtectedRoute — any logged in user
if (!token) return <Navigate to="/login" />

// AdminRoute — admin only
if (!token) return <Navigate to="/login" />
if (user?.role !== "admin") return <Navigate to="/dashboard" />
```

---

## API Endpoints

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| POST | /auth/register | Public | Create new account |
| POST | /auth/login | Public | Login, returns JWT |
| GET | /auth/profile | authenticate | Get current user |
| GET | /auth/admin | authenticate + authorize("admin") | Admin only |

---

## Environment Variables

### Backend `.env`
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your_secret_key_here
PORT=3000
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:3000
```

---

## Getting Started

### Backend
```bash
cd auth-api
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd auth-frontend
npm install
npm run dev
```

---

## Key Concepts

| Concept | What it does |
|---------|-------------|
| bcrypt | Hashes passwords — never store plain text |
| JWT | Stateless token — proves identity on every request |
| JWT_SECRET | Signs and verifies tokens — keep this private |
| authenticate | Middleware — verifies JWT on protected routes |
| authorize | Middleware — checks role for RBAC |
| Axios interceptor | Automatically attaches token to every request |
| ProtectedRoute | React component — redirects if not logged in |
| AdminRoute | React component — redirects if not admin |
| localStorage | Stores JWT on the client |
| jwt-decode | Reads JWT payload on the frontend without secret |
| Zustand | Holds auth state (user + token) globally |
