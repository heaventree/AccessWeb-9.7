
# AI Integration Guidelines

## Assistant Roles
- AI Form Builder: Suggests field groups from user input.
- AI Debugger: Detects errors, suggests fixes with source mapping.
- AI Styler: Suggests Tailwind class improvements.
- AI Accessibility Auditor: WCAG contrast and role checks.

## Prompt Engineering
- Always define role + objective.
- Include example input/output when calling the LLM.
```json
{ "role": "AI_DEBUGGER", "objective": "Fix broken submit logic", "example_input": "form fails on field blur" }
```

## Memory & Fix Log
- Failed states hashed and remembered in `errors.json`.
- Fixes are auto-suggested when hash reoccurs.
- Supports rollback or auto-application of fix.

## Safety
- No AI writes directly to DB or filesystem without diff + user confirm.
- Logs all requests/responses for auditability.

## Accessibility AI
- Color checker recommends token-safe palette.
- Label + aria-role suggester.
