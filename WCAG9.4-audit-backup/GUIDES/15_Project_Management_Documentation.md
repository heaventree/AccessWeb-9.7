
# Project Management & Documentation

## Core Files
- `README.md`: Project intro, tech, scripts, deployment guide
- `PLANNING.md`: Tech stack, constraints, scope, agents
- `TASK.md`: Backlog, active tasks, discovered issues

## Workflow
- Use GitHub Projects or ClickUp for sprint boards
- Sync with Bolt or AI agent memory via docs/tasks

## Contribution Guidelines
- PR template includes:
  - Description
  - Screenshots
  - Checklist (tests, lint, docs)
- Issues must include steps to reproduce + log output

## Coding Standards
- Use Prettier and ESLint
- All code typed (no `any`)
- Prefer `const` over `let`, top-down logic

## Docs & Dev Portal
- All feature folders must include `README.md`
- Use Docusaurus or Docsify for frontend portal

## Agent Context Handoff
- Agents must read PLANNING.md + TASK.md on load
- Every task closes with `update TASK.md + README.md`
