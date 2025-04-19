
# Routing & Navigation

## Structure
- **React Router v6**: Frontend SPA routing with nested routes
- **Dynamic Routing**: e.g., `/[workspace]/forms/[formId]`
- **Protected Routes**: Guards based on auth + RBAC

## Route Types
- `/auth/login`, `/auth/register`, `/auth/callback`
- `/dashboard`, `/dashboard/forms`, `/dashboard/forms/:id`
- `/admin`, `/admin/users`, `/admin/templates`
- `/public/:templateId`

## Guards & Middleware
```tsx
<Route path="/admin" element={<RequireRole role="admin"><AdminPanel /></RequireRole>} />
```

## Breadcrumbs & Navigation State
- Use route metadata (`label`, `parent`) for dynamic breadcrumbs
- Sidebar updates via current route detection

## Meta Tags & SEO
- Each route includes Head/meta injection via React Helmet
- OpenGraph + JSON-LD support for public pages

## Not Found / Fallbacks
- Catch-all 404 route with logging
- Fallback UI for network timeouts + error boundaries
