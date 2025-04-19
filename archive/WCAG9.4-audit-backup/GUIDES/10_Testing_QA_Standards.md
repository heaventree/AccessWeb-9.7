
# Testing & QA Standards

## Unit Testing
- Use **Jest** + **React Testing Library**
- Each component must have:
  - Happy path test
  - Edge case
  - Error state fallback
```tsx
it("should render error if field is required", () => {
  render(<MyForm />);
  fireEvent.submit(screen.getByText("Submit"));
  expect(screen.getByText("This field is required")).toBeInTheDocument();
});
```

## Integration Testing
- Cover major flows (auth, form save, submit)
- Mock APIs using MSW (Mock Service Worker)

## E2E Testing
- Use **Cypress** for workflows:
  - Login + dashboard rendering
  - Form creation, submission, PDF export

## Accessibility Testing
- Use `jest-axe` for static audits
- Lighthouse CI integration for WCAG scoring

## Performance Benchmarks
- Include metrics in CI: Time to Interactive, First Contentful Paint

## Code Quality Checks
- Run `npm run lint` + `npm run test` on all PRs
- PR blocked if test coverage < 85%
