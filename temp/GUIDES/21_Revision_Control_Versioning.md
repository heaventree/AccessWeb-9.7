
# Revision Control & Versioning

## Git Workflow
- One branch per feature/bugfix
- PR must reference an issue
- Merge via squash + delete branch

## Branch Naming
- `feature/form-autosave`
- `fix/route-guard-error`
- `test/e2e-form-submit`

## Commit Standards
```
feat: add AI assistant role detection
fix: prevent crash on null template
test: add missing accessibility audit cases
```

## Tags & Releases
- Use semantic versioning: `v1.3.0`
- Patch = fix, Minor = feature, Major = breaking

## Snapshot System
- Full JSON export of state stored in `/snapshots/YYYY-MM-DD.json`
- Manual rollback via admin UI

## Change Logs
- Auto-generated via `commitlint + standard-version`
- Markdown + JSON changelog output

## GitHub Actions
- Auto tag + publish on merge to main
- Attach changelog to GitHub Releases
