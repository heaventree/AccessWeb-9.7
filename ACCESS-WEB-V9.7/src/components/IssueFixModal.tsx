import React from 'react';
import { X } from 'lucide-react';
import type { AccessibilityIssue } from '../types';
import { getWCAGInfo } from '../utils/accessibility/wcagHelper';

interface IssueFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: AccessibilityIssue | null;
}

export function IssueFixModal({ isOpen, onClose, issue }: IssueFixModalProps) {
  if (!isOpen || !issue) return null;

  const wcagInfo = getWCAGInfo(issue.id);

  // Function to get appropriate success criteria based on issue type
  const getSuccessCriteria = () => {
    if (wcagInfo?.successCriteria) {
      return wcagInfo.successCriteria;
    }

    // Fallback based on common accessibility issues
    if (issue.description.toLowerCase().includes('contrast')) {
      return 'Text must have sufficient contrast against its background: 4.5:1 for normal text, 3:1 for large text.';
    } else if (issue.description.toLowerCase().includes('alt')) {
      return 'All images must have alternative text that describes their content or purpose.';
    } else if (issue.description.toLowerCase().includes('heading')) {
      return 'Headings must be properly structured in a logical hierarchy (h1, h2, h3, etc.).';
    } else if (issue.description.toLowerCase().includes('label')) {
      return 'All form controls must have associated labels that clearly describe their purpose.';
    } else if (issue.description.toLowerCase().includes('focus')) {
      return 'All interactive elements must be keyboard accessible and have visible focus indicators.';
    }
    
    return 'This element must meet WCAG accessibility guidelines for proper accessibility support.';
  };

  // Function to get suggested fix based on issue type
  const getSuggestedFix = () => {
    if (wcagInfo?.suggestedFix) {
      return wcagInfo.suggestedFix;
    }

    if (issue.description.toLowerCase().includes('contrast')) {
      return 'Adjust text or background colors to meet minimum contrast requirements. Use a color contrast checker to verify ratios.';
    } else if (issue.description.toLowerCase().includes('alt')) {
      return 'Add meaningful alternative text to the image that describes its content or function.';
    } else if (issue.description.toLowerCase().includes('heading')) {
      return 'Restructure headings to follow proper hierarchy without skipping levels.';
    } else if (issue.description.toLowerCase().includes('label')) {
      return 'Associate form controls with descriptive labels using the "for" attribute or aria-labelledby.';
    } else if (issue.description.toLowerCase().includes('focus')) {
      return 'Ensure all interactive elements can receive keyboard focus and have visible focus indicators.';
    }
    
    return 'Review WCAG guidelines for this specific issue and implement the recommended accessibility improvements.';
  };

  // Function to get code example based on issue type
  const getCodeExample = () => {
    if (wcagInfo?.codeExample) {
      return wcagInfo.codeExample;
    }

    if (issue.description.toLowerCase().includes('contrast')) {
      return `/* Good Example */
.text-content {
  color: #333333; /* Dark gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 12.6:1 */
}

/* Bad Example */
.text-content {
  color: #999999; /* Light gray text */
  background-color: #FFFFFF; /* White background */
  /* Contrast ratio: 2.85:1 */
}`;
    } else if (issue.description.toLowerCase().includes('alt')) {
      return `<!-- Good Example -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2 2024">

<!-- Bad Example -->
<img src="chart.png" alt="">
<img src="chart.png" alt="chart">`;
    } else if (issue.description.toLowerCase().includes('heading')) {
      return `<!-- Good Example -->
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

<!-- Bad Example -->
<h1>Page Title</h1>
  <h3>Section Title</h3> <!-- Skips h2 -->
    <h2>Subsection Title</h2>`;
    } else if (issue.description.toLowerCase().includes('label')) {
      return `<!-- Good Example -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Bad Example -->
<input type="email" placeholder="Email">`;
    } else if (issue.description.toLowerCase().includes('focus')) {
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
            <h2 className="text-2xl font-semibold text-gray-900">
              How to Fix This Issue
            </h2>
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
            {/* Success Criteria */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Success Criteria
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getSuccessCriteria()}
              </p>
            </div>

            {/* Suggested Fix */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Suggested Fix
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {getSuggestedFix()}
                </p>
              </div>
            </div>

            {/* Code Example */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Code Example
              </h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>{getCodeExample()}</code>
                </pre>
              </div>
            </div>

            {/* Issue Details */}
            {issue.wcagCriteria && issue.wcagCriteria.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  WCAG Guidelines
                </h3>
                <div className="flex flex-wrap gap-2">
                  {issue.wcagCriteria.map((criteria, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {criteria}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Affected Elements */}
            {issue.nodes && issue.nodes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Affected Elements
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {issue.nodes.slice(0, 3).map((node, index) => (
                    <div key={index} className="font-mono text-sm text-gray-700 bg-white p-3 rounded border">
                      {typeof node === 'string' ? node : JSON.stringify(node)}
                    </div>
                  ))}
                  {issue.nodes.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      ... and {issue.nodes.length - 3} more elements
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}