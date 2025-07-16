import React, { useState, useEffect } from 'react';
import { 
  X, 
  Brain, 
  Lightbulb, 
  Code, 
  BookOpen, 
  TestTube, 
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import type { AccessibilityIssue } from '../types';

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: AccessibilityIssue;
}

interface AISuggestion {
  explanation: string;
  suggestedFix: string;
  codeExample: string;
  additionalResources: string[];
  wcagReference: string;
  testingTips: string;
}

export function AISuggestionsModal({ isOpen, onClose, issue }: AISuggestionsModalProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const fetchAISuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/accessibility/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issue: {
            description: issue.description,
            message: issue.message,
            impact: issue.impact,
            wcagCriteria: issue.wcagCriteria,
            element: issue.element,
            selector: issue.selector,
            htmlCode: issue.htmlCode,
            nodes: issue.nodes
          },
          issueElement: issue.element || issue.selector,
          issueType: issue.type || issue.id
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI suggestions');
      }

      setSuggestions(data.data);
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    if (isOpen && !suggestions && !isLoading) {
      fetchAISuggestions();
    }
  };

  // Trigger fetching when modal opens
  useEffect(() => {
    handleOpen();
  }, [isOpen]);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} copied to clipboard`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatCodeExample = (code: string) => {
    // Clean up and format the code example
    return code
      .replace(/```[\w]*\n?/g, '') // Remove markdown code blocks
      .replace(/```/g, '') // Remove any remaining backticks
      .trim();
  };

  const formatSuggestedFix = (fix: string) => {
    // Split by numbers and format as numbered list
    const steps = fix.split(/\d+\./).filter(step => step.trim());
    if (steps.length > 1) {
      return steps.map((step, index) => (
        <li key={index} className="mb-2">
          {step.trim()}
        </li>
      ));
    }
    return fix;
  };

  const modalContent = (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        {/* Issue Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-medium text-gray-900 mb-2">Issue Being Analyzed</h3>
          <p className="text-gray-700 text-sm">{issue.description}</p>
          {issue.wcagCriteria && issue.wcagCriteria.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {issue.wcagCriteria.map((criteria, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {criteria}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600">Generating AI suggestions...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <p className="text-red-800 font-medium">Unable to generate suggestions</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={fetchAISuggestions}
                className="mt-2 text-red-700 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Suggestions Content */}
        {suggestions && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Why This Matters</h3>
                  </div>
                  <p className="text-blue-800 text-sm leading-relaxed">{suggestions.explanation}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(suggestions.explanation, 'Explanation')}
                  className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Copy explanation"
                >
                  {copiedSection === 'Explanation' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Suggested Fix */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">How to Fix</h3>
                  </div>
                  <div className="text-green-800 text-sm leading-relaxed">
                    {typeof formatSuggestedFix(suggestions.suggestedFix) === 'object' ? (
                      <ol className="list-decimal list-inside space-y-1">
                        {formatSuggestedFix(suggestions.suggestedFix)}
                      </ol>
                    ) : (
                      <p>{suggestions.suggestedFix}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(suggestions.suggestedFix, 'Fix Steps')}
                  className="ml-2 p-1 text-green-600 hover:text-green-800 transition-colors"
                  aria-label="Copy fix steps"
                >
                  {copiedSection === 'Fix Steps' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Code Example */}
            {suggestions.codeExample && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <Code className="w-5 h-5 text-gray-300 mr-2" />
                      <h3 className="font-medium text-gray-100">Code Example</h3>
                    </div>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{formatCodeExample(suggestions.codeExample)}</code>
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(formatCodeExample(suggestions.codeExample), 'Code')}
                    className="ml-2 p-1 text-gray-300 hover:text-gray-100 transition-colors"
                    aria-label="Copy code"
                  >
                    {copiedSection === 'Code' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Testing Tips */}
            {suggestions.testingTips && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <TestTube className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="font-medium text-purple-900">Testing Tips</h3>
                    </div>
                    <p className="text-purple-800 text-sm leading-relaxed">{suggestions.testingTips}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(suggestions.testingTips, 'Testing Tips')}
                    className="ml-2 p-1 text-purple-600 hover:text-purple-800 transition-colors"
                    aria-label="Copy testing tips"
                  >
                    {copiedSection === 'Testing Tips' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* WCAG Reference */}
            {suggestions.wcagReference && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center mb-2">
                  <BookOpen className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="font-medium text-yellow-900">WCAG Reference</h3>
                </div>
                <p className="text-yellow-800 text-sm">{suggestions.wcagReference}</p>
              </div>
            )}

            {/* Additional Resources */}
            {suggestions.additionalResources && suggestions.additionalResources.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center mb-3">
                  <ExternalLink className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="font-medium text-indigo-900">Additional Resources</h3>
                </div>
                <ul className="space-y-2">
                  {suggestions.additionalResources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-700 hover:text-indigo-800 text-sm underline flex items-center"
                      >
                        {resource}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              AI suggestions are recommendations. Always test thoroughly before implementing.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      {modalContent}
    </Modal>
  );
}