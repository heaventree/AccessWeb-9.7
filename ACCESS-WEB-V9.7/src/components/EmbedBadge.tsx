import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface EmbedBadgeProps {
  url: string;
  score: number;
}

export function EmbedBadge({ url, score }: EmbedBadgeProps) {
  const [copied, setCopied] = useState(false);

  // Create a unique identifier for the website based on URL
  const siteId = btoa(url).replace(/[^a-zA-Z0-9]/g, '');
  
  const badgeScript = `<script src="${window.location.origin}/badge.js" data-site-id="${siteId}" async></script>`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(badgeScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPassing = score >= 80;

  return (
    <div className={`${isPassing ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} p-4 rounded-lg border`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${isPassing ? 'text-green-800' : 'text-amber-800'} mb-2`}>
            {isPassing ? (
              <>🎉 Congratulations! Your site has good accessibility</>
            ) : (
              <>⚠️ Your site needs accessibility improvements</>
            )}
          </h3>
          <p className={`text-sm ${isPassing ? 'text-green-700' : 'text-amber-700'} mb-4`}>
            {isPassing ? (
              <>Show your commitment to web accessibility by adding this badge to your website</>
            ) : (
              <>After fixing the issues, test again to earn the accessibility badge</>
            )}
          </p>
        </div>
        <div className="ml-0 sm:ml-4">
          {/* Preview of how the badge will look */}
          <div className={`inline-flex items-center ${
            isPassing 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-300 text-gray-600'
            } px-3 py-2 rounded-full text-sm font-medium`}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            WCAG {score >= 90 ? 'AAA' : 'AA'} Compliant
          </div>
        </div>
      </div>
      
      {isPassing && (
        <>
          <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <code className="text-sm text-gray-800 break-all overflow-x-auto">{badgeScript}</code>
              <button
                onClick={handleCopy}
                className="shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#0fae96] hover:bg-[#0c9a85] rounded-full transition-colors"
                aria-label={copied ? "Copied to clipboard" : "Copy badge code"}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            Add this code to your website to display the accessibility compliance badge. The badge will automatically update if your site's accessibility status changes.
          </p>
        </>
      )}
    </div>
  );
}