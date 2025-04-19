
# State Management Best Practices

## Global Store: Zustand
- One flat store per feature (`useFormStore`, `useAuthStore`).
- Immer middleware enabled for immutability.
- Namespaced selectors preferred:
```ts
const fields = useFormStore(s => s.fields);
```

## Context API for Cross-Cutting Concerns
- Use for Auth, Theme, ModalManager, i18n
- Never mix with feature-specific state.

## Async State
- Handle via effects and loading flags.
- Use `zustand-persist` for form draft state.

## Reset Strategy
- All stores must include a `reset()` function.
- On logout or switch workspace, reset all global state.

## Testing State
- Mock store per test file.
- Validate state before and after actions.
