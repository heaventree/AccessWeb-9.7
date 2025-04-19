
# Backup, Recovery & Safety

## Autosave System
- Form state autosaved to IndexedDB every 5s
- Synced with cloud every 60s if online

## Snapshots
- Full UI state + user context saved every 10 minutes
- Snapshot stored in `snapshots/` folder (ID + timestamp)
- Users can manually trigger snapshot

## Recovery Flow
- On crash, UI presents "restore last snapshot" modal
- Previous states can be diffed before apply

## Persistent Storage Tools
- **LocalForage** for structured offline support
- **Encrypted Storage** using AES keys per user/session

## Audit Logs
- AI-assisted logs track:
  - Errors, Fixes, User action chain
  - Auto-fixes + human confirms

## Cloud Redundancy
- Snapshots synced to:
  - Supabase (PostgreSQL blob)
  - GitHub Gist (if token present)
  - Dropbox/OneDrive (via SDK)

## Manual Restore Options
- Admin can upload `.snapshot.json` file to restore full session
