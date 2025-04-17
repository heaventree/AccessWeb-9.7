
# UI Debugging & Section ID System

## Visual Section Markers
- Each UI component block includes a visual badge with a unique Section ID.
- Used for debugging, layout targeting, and AI feedback.

## Format
```tsx
<div data-section="UI-3.2.1" className="debug-section">
  <Badge>ID: UI-3.2.1</Badge>
  <FormField />
</div>
```

## Location Convention
- Format: `UI-{page}.{block}.{element}`
  - Example: `UI-2.1.3` = Page 2, Block 1, Element 3

## Debug View Mode
- Toggles via dev console (`debug.toggleSections()`)
- Adds borders + labels around each debug block

## Integration with Logger
- On error, UI path is logged using the closest `data-section`:
```json
{ "error": "undefined input", "section": "UI-4.2.5" }
```

## Benefits
- Makes debugging and support traceable to UI blocks
- Aids in selective CSS overrides
- Can be referenced in AI support logs and agent memory
