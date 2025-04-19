
# Authentication & Security

## Auth Providers
- **Clerk** or **Auth0** or **Supabase Auth**
- Email + password, Google OAuth, GitHub OAuth

## Roles & Permissions
- RBAC system:
  - admin
  - editor
  - reviewer
  - client
```ts
if (user.role !== 'admin') return redirect('/403');
```

## Token Handling
- JWT tokens stored in HTTP-only cookies
- Refresh tokens handled server-side

## Protected Routes
- Middleware guards every route group
- Server-side checks mirror client guards

## Rate Limiting
- 100 requests/min/IP via middleware
- Redis backed or platform-native (e.g. Vercel)

## CSP & Headers
- Helmet or platform-level CSP settings
- Disallow `unsafe-inline`, restrict script-src

## Encryption & Hashing
- Passwords: bcrypt + salt
- Tokens: HMAC256 or SHA256
- Data at rest: AES 256
