
# DevOps & Infrastructure

## Deployment Targets
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Fly.io, DigitalOcean
- **Assets**: S3 or Supabase

## Docker Support
- Full Dockerfile per microservice:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["node", "dist/index.js"]
```

## CI/CD
- GitHub Actions for:
  - Linting (`eslint .`)
  - Unit tests (`jest --coverage`)
  - Build check (`vite build`)
  - Deploy to host

## Monitoring
- **Sentry** for crash logs
- **PostHog** for session replays
- **LogRocket** optional for heatmaps

## Environment Setup
- `.env.example` defines:
  - SUPABASE_URL
  - OPENAI_API_KEY
  - STRIPE_SECRET
- `.env.local` must be Git-ignored

## Failover & Scaling
- Use Cloudflare edge cache
- Scale containers via auto-scaling in Render/Fly
