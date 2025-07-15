import React from 'react';
import { X, Lightbulb, Code } from 'lucide-react';
import type { AccessibilityIssue } from '../types';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: AccessibilityIssue | null;
}

export function AISuggestionModal({ isOpen, onClose, issue }: AISuggestionModalProps) {
  if (!isOpen || !issue) {
    return null;
  }

  // Generate AI analysis based on issue data
  const getAIAnalysis = () => {
    const desc = issue.description.toLowerCase();
    
    if (desc.includes('structure') || desc.includes('semantic') || issue.id === '1.3.1') {
      return 'Information, structure, and relationships conveyed through presentation can be programmatically determined.';
    } else if (desc.includes('contrast') || issue.id === '1.4.3') {
      return 'Text content lacks sufficient color contrast with its background, making it difficult for users with visual impairments to read.';
    } else if (desc.includes('alt') || desc.includes('image') || issue.id === '1.1.1') {
      return 'Images are missing alternative text that describes their content or purpose for screen reader users.';
    } else if (desc.includes('label') || desc.includes('form')) {
      return 'Form controls are missing proper labels, making them inaccessible to screen reader users and difficult to understand.';
    } else if (desc.includes('focus') || desc.includes('indicator')) {
      return 'Interactive elements lack visible focus indicators, making keyboard navigation difficult for users.';
    }
    
    return issue.description || 'This accessibility issue affects user experience and WCAG compliance.';
  };

  // Generate suggested fix based on issue data
  const getSuggestedFix = () => {
    const desc = issue.description.toLowerCase();
    
    if (desc.includes('structure') || desc.includes('semantic') || issue.id === '1.3.1') {
      return 'Use appropriate HTML elements like nav, main, article, aside. Use proper heading hierarchy. Associate form labels with controls.';
    } else if (desc.includes('contrast') || issue.id === '1.4.3') {
      return 'Adjust text or background colors to meet minimum contrast requirements (4.5:1 for normal text, 3:1 for large text). Use a color contrast checker to verify ratios.';
    } else if (desc.includes('alt') || desc.includes('image') || issue.id === '1.1.1') {
      return 'Add descriptive alternative text to images that convey information. Use empty alt="" for decorative images.';
    } else if (desc.includes('label') || desc.includes('form')) {
      return 'Add visible labels to form controls and ensure they are properly associated using for/id attributes or by wrapping the control with the label element.';
    } else if (desc.includes('focus') || desc.includes('indicator')) {
      return 'Add visible focus indicators using CSS :focus pseudo-class with outline or border styles.';
    }
    
    return issue.fixSuggestion || 'Review WCAG guidelines for this specific issue and implement the recommended accessibility improvements.';
  };

  // Generate code example based on issue data
  const getCodeExample = () => {
    const desc = issue.description.toLowerCase();
    const affectedElement = issue.nodes?.[0] || '';
    
    if (desc.includes('structure') || desc.includes('semantic') || issue.id === '1.3.1') {
      return `<!-- Good Example -->
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <h1>Main Content</h1>
  <article>
    <h2>Article Title</h2>
    <p>Content...</p>
  </article>
</main>`;
    } else if (desc.includes('contrast') || issue.id === '1.4.3') {
      return `/* Good Example */
.text-content {
  color: #333333; /* Dark gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 12.63:1 */
}

/* Bad Example */
.text-content {
  color: #999999; /* Light gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 2.85:1 */
}`;
    } else if (desc.includes('alt') || desc.includes('image') || issue.id === '1.1.1') {
      return `<!-- Good Example -->
<img src="logo.png" alt="Company Name Logo">
<img src="chart.png" alt="Sales growth chart showing 25% increase in Q4">
<img src="decoration.png" alt="" role="presentation">

<!-- Bad Example -->
<img src="logo.png">
<img src="chart.png" alt="chart">
<img src="photo.jpg" alt="image">`;
    } else if (desc.includes('label') || desc.includes('form')) {
      return `<!-- Good Example -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<label>
  Password
  <input type="password" name="password">
</label>

<!-- Bad Example -->
<input type="email" placeholder="Enter email">
<div>Password</div>
<input type="password">`;
    } else if (desc.includes('focus') || desc.includes('indicator')) {
      return `/* Good Example */
button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Bad Example */
button:focus {
  outline: none; /* Removes focus indicator */
}`;
    }

    // If we have the actual affected element, show it
    if (affectedElement) {
      return `<!-- Affected Element: -->
${affectedElement}

<!-- Example implementation will depend on the specific issue -->
<!-- Refer to WCAG documentation for detailed examples -->`;
    }

    return `<!-- Example implementation will depend on the specific issue -->
<!-- Refer to WCAG documentation for detailed examples -->`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <div className="relative inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                AI Analysis
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* AI Analysis */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {getAIAnalysis()}
              </p>
            </div>

            {/* Suggested Fix */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Suggested Fix
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {getSuggestedFix()}
              </p>
            </div>

            {/* Code Example */}
            <div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-sm text-gray-400 ml-2">Good Example</span>
                  </div>
                </div>
                <pre className="text-green-400 p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>{getCodeExample()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}