
# Form Engine & Management

## Form Builder Design
- Forms stored as JSON schema (fields, labels, logic).
- Field types: text, email, dropdown, radio, checkbox, date, number, file, rich text.
- Each field includes `id`, `type`, `label`, `required`, `defaultValue`, `options`, `conditionalLogic`.

## Draft & Autosave Support
- LocalForage-backed storage of partial form data.
- Form state autosaved every 5 seconds or on blur.

## Form Schema Versioning
- Git-style diffing between versions.
- Changeset viewer: new, removed, modified fields.

## Conditional Logic Engine
- Logic like: “If [field-x] = 'yes', show [field-y]”.
- Nested support and `AND/OR` grouping.

## Form Validation
- Zod schema validated on submit and blur.
- Server-side validation mirrors client schema.
- Prevents mismatches and hidden injection.

## Submissions
- Stored as immutable JSON blob with metadata.
- PDF export (via `pdf-lib` or API) on submit.
- Resume links include submission ID and optional expiry.

## Accessibility
- All fields keyboard navigable.
- Proper labeling via `aria-describedby`, `for`, `id` attributes.
