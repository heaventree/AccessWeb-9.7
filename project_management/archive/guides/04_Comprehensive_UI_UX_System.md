
# Comprehensive UI/UX System

## Typography
- Primary: Inter / Plus Jakarta Sans
- Heading scale: clamp(1.2rem, 2.5vw, 3rem)
- Line height: 1.5 for body, 1.25 for headings

## Layout
- Max width: 1440px centered with padding
- Sidebar: 280px, collapsible on mobile
- Card spacing: 24px grid
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`

## Components
- Consistent border radius: `rounded-2xl`
- Shadow: `shadow-md` default, `hover:shadow-lg`
- Form field layout: label above, help below, error at bottom

## Motion & Animation
- Animate presence via Framer Motion
- Transition durations: 200ms (fast), 400ms (default), 600ms (slow)
- `ease-in-out` default easing

## Color & Accessibility
- WCAG AA+ contrast via Tailwind theme overrides
- Built-in color palette generator with contrast validator
- Keyboard navigation: full tab order and focus traps
- ARIA: roles, labels, regions for all interactive UI

## Branding & White-Label Support
- Theme overrides per tenant (via Tailwind CSS variables)
- Uploadable logos, color sets, dashboard themes
