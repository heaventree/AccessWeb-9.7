
# Accessibility & Compliance

## Standards Target
- WCAG 2.1 AA+ level
- Screen reader + keyboard navigation 100% coverage

## Color Contrast
- Tailwind color overrides for contrast
- Auto-check during dev via `@tailwind-accessible`
- Contrast tool + AI suggester built in

## Navigation
- Tab sequence strictly linear
- Focus ring shown via `focus-visible:outline-ring`
- Skip-to-content link on every page

## ARIA & Labels
- Use `aria-labelledby`, `aria-describedby`, `role`, `aria-hidden`
- All custom components must mimic native equivalents

## Screen Readers
- Test via NVDA, VoiceOver on Mac
- Announce modals, toasts, status messages

## Automated Audit Tools
- `axe-core` + `jest-axe` in test pipeline
- Lighthouse score must remain 100% for accessibility
