
# Developer Environment Setup

## Prerequisites
- Node.js (v18+)
- pnpm or npm 8+
- Docker (optional, for DB and API testing)
- GitHub CLI (gh)

## Setup Steps
```bash
git clone <repo>
cd project
cp .env.example .env.local
pnpm install
pnpm dev
```

## ENV Keys
```
OPENAI_API_KEY=
STRIPE_SECRET=
SUPABASE_URL=
SUPABASE_ANON=
```
- Never commit `.env.local`

## Scripts
- `dev`: start local dev server
- `build`: optimize app for prod
- `lint`: run Prettier + ESLint
- `test`: run unit + integration tests

## Git Setup
- One feature branch per PR
- Branch naming: `feature/`, `fix/`, `test/`, `docs/`
- CI enforces lint + test before merge

## Editor Setup
- Recommend VS Code + extensions:
  - Prettier, ESLint, Tailwind IntelliSense, GitLens
