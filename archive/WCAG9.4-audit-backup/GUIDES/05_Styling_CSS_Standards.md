
# Styling & CSS Standards

## Tailwind CSS Conventions
- Use utility-first classes.
- Avoid custom CSS unless necessary.
- Prefer `@apply` only in `components.css` or theme tokens.
- Maintain spacing and layout consistency via Tailwind's scale (`p-4`, `mt-6`, `gap-8`).

## Typography System
- Use `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`.
- Headings use `font-bold`, body `font-normal`.
- Always use `prose` class for rich text rendering.

## Color Tokens & Dark Mode
- Use design tokens via `tailwind.config.js` (`primary`, `secondary`, `bg-default`, `text-muted`).
- Implement dark mode using `class` strategy (not media).
- Accessible contrast enforced via custom plugin or WCAG AI checks.

## Responsive Layout Rules
- Use `flex`, `grid`, `container`, `max-w-screen-xl`.
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`.
- Avoid fixed px widths.

## Animations
- `transition`, `duration-200`, `ease-in-out` by default.
- Animate layout or visibility via Framer Motion, not CSS alone.

## Do/Don't Examples
```css
/* ✅ GOOD */
<div class="bg-primary text-white p-4 rounded-lg shadow-md">

/* ❌ AVOID */
<div style="background: #3282F6; padding: 10px; color: white">
```

## SCSS/Custom CSS Rules
- Only used for 3rd party overrides or global theming.
- Must live in `/styles/globals.css` and be scoped with BEM.
