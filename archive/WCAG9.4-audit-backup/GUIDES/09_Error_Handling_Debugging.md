
# Error Handling & Debugging

## Structured Logging
- Central `logger.ts` with `log.info`, `log.warn`, `log.error`
- Tagged logs per module
- In production, logs sent to Sentry

## Error Boundary System
- Top-level `<ErrorBoundary>` wraps all pages
- Boundaries at feature level catch local crashes

## Recovery UI
- Friendly fallback messages (`"Something went wrong. Try again or contact support."`)
- Retry button re-invokes failed effect

## Snapshot System
- State snapshots every 5 minutes
- Auto-revert on crash based on hash match

## Debug Tools
- Developer console (`devtools.show()`) with form tree + field debugger
- Error hash memory maps known issues to fixes

## Monitoring
- Client: PostHog for console events
- Server: Sentry + error deduplication

## Known Error Registry
- `errors.json` contains hash → solution mappings
- Used by AI agents + manual fallback UI
