import type { Article } from '../../../types/blog';

export const wcagResource4: Article = {
  "id": "wcag-resource-4",
  "slug": "wcag-resource-key-updates-in-wcag-22",
  "title": "Key Updates in WCAG 2.2",
  "description": "Release Date: WCAG 2.2 became a W3C Recommendation on October 5, 2023. Release Date: WCAG 2.2 became a W3C Recommendation on October 5, 2023.",
  "content": "# Key Updates in WCAG 2.2 (newest standard, October 2023)\n\n**Release Date**: WCAG 2.2 (newest standard, October 2023) became a W3C Recommendation on October 5, 2023.\n\n**Main Focus**: WCAG 2.2 (newest standard, October 2023) builds upon WCAG 2.1 (current technical standard), adding new success criteria primarily aimed at improving accessibility for users with cognitive or learning disabilities, users with low vision, and users on mobile devices. It also removes one criterion (4.1.1 Parsing).\n\n**New Success Criteria (Examples)**:\n*   **2.4.11 Focus Not Obscured (Minimum) (AA)**: Ensures that when an element receives focus, it's not completely hidden by other content (like sticky headers/footers).\n*   **2.5.7 Dragging Movements (AA)**: If functionality requires dragging, provide a simple pointer alternative (e.g., click/tap).\n*   **3.3.7 Redundant Entry (A)**: Avoid asking users to re-enter information they've already provided in the same process.\n*   **3.3.8 Accessible Authentication (Minimum) (AA)**: Don't rely solely on cognitive function tests (like remembering passwords or solving puzzles) for authentication if alternatives exist.\n\n**Backward Compatibility**: WCAG 2.2 (newest standard, October 2023) maintains backward compatibility with 2.1 and 2.0. Content conforming to 2.2 also conforms to 2.1 and 2.0.\n\n## Implementation Tips\n\n- Create an alt text style guide for your content team\n- Use contextual alt text that conveys the purpose of the image\n- Keep alt text concise (generally under 125 characters)\n- Use empty alt attributes (alt="") for decorative images\n- Regularly audit images to ensure all have appropriate alt text",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "WCAG 2.1",
    "WCAG 2.2",
    "Semantic HTML",
    "Mobile Accessibility",
    "Form Controls"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2023-06-29T16:43:42.220Z",
  "updatedAt": "2024-06-03T01:34:29.017Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/",
  "tableOfContents": [
    {
      "id": "release-date",
      "title": "Release Date",
      "level": 2
    },
    {
      "id": "main-focus",
      "title": "Main Focus",
      "level": 2
    },
    {
      "id": "new-success-criteria-examples",
      "title": "New Success Criteria (Examples)",
      "level": 2
    },
    {
      "id": "2411-focus-not-obscured-minimum-aa",
      "title": "2.4.11 Focus Not Obscured (Minimum) (AA)",
      "level": 2
    },
    {
      "id": "257-dragging-movements-aa",
      "title": "2.5.7 Dragging Movements (AA)",
      "level": 2
    },
    {
      "id": "337-redundant-entry-a",
      "title": "3.3.7 Redundant Entry (A)",
      "level": 2
    },
    {
      "id": "338-accessible-authentication-minimum-aa",
      "title": "3.3.8 Accessible Authentication (Minimum) (AA)",
      "level": 2
    },
    {
      "id": "backward-compatibility",
      "title": "Backward Compatibility",
      "level": 2
    }
  ]

};
