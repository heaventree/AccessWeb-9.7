
# Animation & Motion Guidelines

## Motion Library
- Use Framer Motion exclusively
- Animate presence + transitions declaratively

## Standard Transitions
- Enter: fade-in + translateY(10px)
- Exit: fade-out + scale down
- Easing: `easeInOut`, duration: 200–400ms

## Element Types
- Modals: `AnimatePresence` + scale/fade
- Buttons: subtle hover + press feedback
- Tooltips: zoom-in on hover

## Accessibility
- Respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## Performance
- Avoid animating `width`, `height`, or `top`
- Use transforms (`translate`, `scale`, `opacity`)
- Combine layout + presence animations via `layoutId`
