
# Knowledgebase & AI Agent Learning

## AI Memory System
- Errors are hashed and stored on failure
- Hashes link to file/line/suggested fix
- AI checks hash on every error rerun

## Agent Roles
- `debugger`, `builder`, `styler`, `auditor`, `navigator`

## File Awareness
- Agent knows file structure + data source
- Will not hallucinate imports or paths

## Prompt Memory
- Agents reference TASK.md + PLANNING.md at session start
- Memory includes last 20 errors, 20 fixes

## Project Indexing
- `project.index.json` stores all endpoints, schemas, pages, types

## Fix Suggestions
- LLM fix proposals are diffed before apply
- User can approve or rollback

## Audit Trail
- Logs contain:
  - Original code
  - AI suggestion
  - User decision
  - Final commit
