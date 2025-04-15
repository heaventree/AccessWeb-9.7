
# Directory & File Structure

## Top-Level Structure
```
/src
  /components     # Shared UI elements (Buttons, Modals, Tables)
  /features       # Self-contained feature modules (FormBuilder, Auth)
  /layouts        # Layout wrappers (Dashboard, Public)
  /pages          # Route definitions and top-level views
  /hooks          # Custom React hooks
  /lib            # Utilities and shared logic (validators, formatters)
  /store          # Zustand or Context-based global state
  /types          # Global TypeScript types and interfaces
  /styles         # Global Tailwind + override styles
  /ai             # AI integration logic (debugging, assistants)
  /tests          # Unit/integration tests
```

## Guidelines
- Keep files <500 lines, use helper modules if larger
- No feature can mutate outside its own context/state
- Prefer co-located components per feature (e.g. `FormBuilder/components/Field.tsx`)
- Keep `/lib` purely functional — no React logic

## File Naming
- `camelCase.ts` for hooks, utils, config
- `PascalCase.tsx` for components
- `kebab-case.css` for global styles

## Multi-Tenant Separation
- Each tenant has isolated workspace state
- Per-tenant layout rendering via `/[workspace]/dashboard.tsx`
