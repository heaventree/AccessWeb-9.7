
# Performance Optimization Standards

## Frontend Optimizations
- Tree shaking via Vite + ES modules
- Code splitting via dynamic import + lazy
- Minify everything: CSS, JS, fonts

## Image Handling
- Use `next/image` or `<Image />` with srcset + WebP fallback
- LQIP (low quality image placeholder) for pre-load

## API Strategy
- Debounce inputs, paginate fetches
- Cache reads (React Query or SWR)
- Use `304` Not Modified if ETag matches

## Asset Strategy
- Fonts self-hosted, subset via Google Fonts
- Icons via Lucide (tree-shakeable)
- Only use third-party scripts async/defer

## Lighthouse Targets
- Time to Interactive < 2s
- Largest Contentful Paint < 1.5s
- JS payload < 150kb initial

## Build Analysis
- `vite build --report` to visualize chunks
- Warn if node_modules chunk > 50%
