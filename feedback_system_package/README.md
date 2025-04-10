# Feedback & Admin Dashboard System

A comprehensive system for collecting user feedback and managing debug items, roadmap features, and project completion tracking in React applications.

## Features

- **Contextual Feedback System**: Allow users to click on any element and leave feedback right in the context of your UI
- **Element Tracking**: Feedback markers that stick to elements even when scrolling or page layout changes
- **Debug Dashboard**: Track bugs, issues, and development tasks with filtering by status, category, priority
- **Roadmap Dashboard**: Manage feature planning with dependencies and implementation status
- **Completion Dashboard**: Visualize overall project completion with category-by-category progress
- **Automatic Categorization**: Smart categorization of feedback based on the element type
- **Persistent Storage**: Feedback data persists in localStorage by default
- **Customizable Styling**: Uses TailwindCSS for easy styling customization

## Installation

```bash
npm install feedback-admin-dashboard-system
```

## Quick Start

1. Add the `SimpleFeedbackSystem` component to your main App component:

```jsx
import { SimpleFeedbackSystem } from 'feedback-admin-dashboard-system';

function App() {
  return (
    <>
      {/* Your existing app components */}
      <SimpleFeedbackSystem />
    </>
  );
}
```

2. Add routes for the admin dashboards:

```jsx
import { AdminDebug, AdminRoadmap, CompletionDashboard } from 'feedback-admin-dashboard-system';

// In your routes configuration:
<Route path="/admin/debug" element={<AdminDebug />} />
<Route path="/admin/roadmap" element={<AdminRoadmap />} />
<Route path="/admin/completion" element={<CompletionDashboard />} />
```

## Customization

The system is highly customizable. See the detailed documentation in [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for information on:

- Customizing categories, statuses, and priorities
- Adjusting the styling to match your application
- Extending the system with new feedback types
- Creating custom admin views

## Requirements

- React 16.8+ (uses hooks)
- TypeScript 4.0+ (recommended)
- TailwindCSS (recommended for styling)
- Lucide React (for icons)
- React Router Dom 6+ (for page-specific feedback)

## License

MIT