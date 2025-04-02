import type { Article } from '../../../types/blog';

export const wcagResource12: Article = {
  "id": "wcag-resource-12",
  "slug": "wcag-resource-designing-for-color-blindness",
  "title": "Designing for Color Blindness",
  "description": "Understanding Color Blindness: Affects how individuals perceive colors. The most common form is red-green color blindness. It's not actual blindnes...",
  "content": "# Designing for Color Blindness\n\n**Understanding Color Blindness**: Affects how individuals perceive colors. The most common form is red-green color blindness. It's not actual blindness but a deficiency in distinguishing between certain colors.\n\n**Key Considerations & WCAG Links**:\n*   **Don't Rely Solely on Color (Guideline 1.4.1 - Level A)**: Information conveyed by color differences must also be available through other means (e.g., text labels, patterns, icons). Example: Using only red/green to indicate required fields or error states is insufficient. Add an asterisk or text label.\n*   **Color Contrast (Guideline 1.4.3 - Level AA / 1.4.6 - Level AAA)**: Ensure sufficient contrast between text and background colors. This helps not only people with low vision but also those with color vision deficiencies.\n*   **Use Patterns/Textures**: In charts and graphs, use distinct patterns or textures in addition to color to differentiate data sets.\n\n**Tools**:\n*   **Contrast Checkers**: WebAIM Contrast Checker, Colour Contrast Analyser.\n*   **Simulators**: Coblis — Color Blindness Simulator, browser extensions (e.g., NoCoffee Vision Simulator) to view pages as someone with color blindness might.",
  "category": "wcag-resources",
  "tags": [
    "WCAG",
    "Accessibility",
    "Web Standards",
    "Color Contrast"
  ],
  "author": {
    "name": "Accessibility Team",
    "avatar": "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "role": "WCAG Specialists"
  },
  "publishedAt": "2024-01-13T10:41:30.501Z",
  "updatedAt": "2024-06-20T06:20:26.013Z",
  "readingTime": "3 min read",
  "vectorImage": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "isResource": true,
  "wcagReference": "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color",
  "tableOfContents": [
    {
      "id": "understanding-color-blindness",
      "title": "Understanding Color Blindness",
      "level": 2
    },
    {
      "id": "key-considerations-wcag-links",
      "title": "Key Considerations & WCAG Links",
      "level": 2
    },
    {
      "id": "dont-rely-solely-on-color-guideline-141-level-a",
      "title": "Don't Rely Solely on Color (Guideline 1.4.1 - Level A)",
      "level": 2
    },
    {
      "id": "color-contrast-guideline-143-level-aa-146-level-aaa",
      "title": "Color Contrast (Guideline 1.4.3 - Level AA / 1.4.6 - Level AAA)",
      "level": 2
    },
    {
      "id": "use-patternstextures",
      "title": "Use Patterns/Textures",
      "level": 2
    },
    {
      "id": "tools",
      "title": "Tools",
      "level": 2
    },
    {
      "id": "contrast-checkers",
      "title": "Contrast Checkers",
      "level": 2
    },
    {
      "id": "simulators",
      "title": "Simulators",
      "level": 2
    }
  ]
};
