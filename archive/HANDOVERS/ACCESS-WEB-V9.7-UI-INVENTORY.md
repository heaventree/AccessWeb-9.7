# ACCESS-WEB-V9.7 UI Inventory

This document provides a comprehensive inventory of UI elements in the application to serve as a reference before making any changes.

## Navigation Structure

### Main Navigation
- Dashboard link
- Projects link
- Accessibility Tests link
- Reports link
- Settings link
- Integrations link
- Documentation link
- Profile/Account menu

### Secondary Navigation
- Notifications bell icon
- Help/Support icon
- User profile dropdown
- Dark/Light mode toggle
- Accessibility toolbar toggle

## Pages & Key Components

### Landing Page / Home
- Hero section with CTA buttons
- Feature highlights section
- Accessibility statistics
- Getting started section
- Testimonials section
- Contact/Support section
- Footer with links

### Dashboard
- Overview statistics cards
- Recent projects list
- Compliance score charts
- Activity timeline
- Quick action buttons
- Notification center

### Projects Page
- Projects list/grid view
- Create new project button
- Filter and sort controls
- Project cards with:
  - Project name
  - Compliance score
  - Last updated date
  - Number of issues
  - Action buttons (edit, delete, share)

### Accessibility Tests
- Test types section
- WCAG criteria list
- Automated test runner
- Manual test checklist
- Test results visualizations
- Export options

### Reports
- Report templates
- Generated reports list
- Create new report button
- Filtering options
- Export/Share buttons
- Report preview cards

### Settings
- User preferences section
- Account settings
- Notification settings
- API keys and integration settings
- Team member management
- Subscription and billing

### Integrations
- Available integrations list
- Connected integrations
- Integration status indicators
- Shopify integration section
- WordPress integration section
- Custom API setup

### Admin Section
- User management
- System settings
- Audit logs
- Payment gateways
- License management

## Common UI Elements

### Forms
- Input fields
- Dropdown selects
- Checkboxes and radio buttons
- Date pickers
- File upload areas
- Form validation messages
- Submit and cancel buttons

### Modals and Dialogs
- Confirmation dialogs
- Information modals
- Settings/form modals
- Alert messages

### Buttons
- Primary action buttons
- Secondary action buttons
- Tertiary/text buttons
- Icon buttons
- Toggle buttons
- Button groups

### Tables and Lists
- Data tables with sortable columns
- Simple lists
- Card lists
- Pagination controls
- Bulk action controls

### Feedback Elements
- Toast notifications
- Alert banners
- Progress indicators
- Loading spinners
- Success/error messages

### Accessibility Toolbar
- Font size controls
- Contrast mode toggles
- Focus indicators
- Screen reader optimizations
- Color adjustments
- Text spacing controls

## Notes on CSP Issues
The application shows Content Security Policy (CSP) violations related to:
- Stripe.js integration
- Frame-src directives

These are known issues that need to be fixed in the CSP configuration.

---

This inventory was created on April 19, 2025 as a reference point before beginning incremental development work. Any significant changes to the UI structure should be documented as addendums to this document.