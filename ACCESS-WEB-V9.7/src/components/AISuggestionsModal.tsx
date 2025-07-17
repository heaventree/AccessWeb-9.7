import React, { useState, useEffect } from 'react';
import { 
  X, 
  Brain, 
  Code, 
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

  // Trigger fetching when modal opens
  useEffect(() => {
    if (isOpen && !suggestions && !isLoading) {
      fetchAISuggestions();
    }
  }, [isOpen, suggestions, isLoading]);

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
          <div className="space-y-4">
            {/* How to Fix */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
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