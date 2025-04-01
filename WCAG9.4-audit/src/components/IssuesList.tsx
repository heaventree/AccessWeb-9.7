import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PenTool as Tool, BookOpen, Maximize2, Minimize2, Info } from 'lucide-react';
import type { AccessibilityIssue } from '../types';
import { Modal } from './Modal';
import { useApproval } from '../hooks/useApproval';
import { getWCAGInfo } from '../utils/wcagHelper';
import { AIRecommendations } from './AIRecommendations'; 
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

type ModalView = 'info' | 'fix' | null;

interface IssuesListProps {
  issues: AccessibilityIssue[];
  type?: 'issues' | 'passes' | 'warnings';
}

export function IssuesList({ issues, type = 'issues' }: IssuesListProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null);
  const { rollback } = useApproval();
  const [modalView, setModalView] = useState<ModalView>(null);
  const [previousState, setPreviousState] = useState<string | null>(null);

  const getImpactColor = (impact: AccessibilityIssue['impact']) => {
    if (type === 'passes') return 'bg-emerald-50 border-emerald-200';
    if (type === 'warnings') return 'bg-amber-50 border-amber-200';
    
    switch (impact) {
      case 'critical': return expandedIssue ? 'bg-red-50/80 border-red-400' : 'bg-red-50/80 border-red-300';
      case 'serious': return expandedIssue ? 'bg-orange-50/80 border-orange-400' : 'bg-orange-50/80 border-orange-300';
      case 'moderate': return expandedIssue ? 'bg-yellow-50/80 border-yellow-400' : 'bg-yellow-50/80 border-yellow-300';
      case 'minor': return expandedIssue ? 'bg-blue-50/80 border-blue-400' : 'bg-blue-50/80 border-blue-300';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getImpactTagColor = (impact: AccessibilityIssue['impact']) => {
    switch (impact) {
      case 'critical': return 'bg-red-600 text-white';
      case 'serious': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'minor': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const toggleIssue = (id: string) => {
    // Save current state before toggling
    if (expandedIssue !== id) {
      setPreviousState(JSON.stringify({ expandedIssue, selectedIssue, modalView }));
    }
    setExpandedIssue(expandedIssue === id ? null : id);
  };

  const handleRollback = async () => {
    if (!previousState) return;
    
    const result = await rollback('IssuesList');
    if (result.success && result.data) {
      const state = JSON.parse(previousState);
      setExpandedIssue(state.expandedIssue);
      setSelectedIssue(state.selectedIssue);
      setModalView(state.modalView);
      setPreviousState(null);
    }
  };

  const toggleAllIssues = (shouldExpand: boolean) => {
    setPreviousState(JSON.stringify({ expandedIssue, selectedIssue, modalView }));
    setExpandedIssue(shouldExpand ? issues[0]?.id || null : null);
  };

  const openIssueDetails = (issue: AccessibilityIssue) => {
    setPreviousState(JSON.stringify({ expandedIssue, selectedIssue, modalView }));
    setSelectedIssue(issue);
    setModalView('info');
  };

  const openIssueFix = (issue: AccessibilityIssue) => {
    setPreviousState(JSON.stringify({ expandedIssue, selectedIssue, modalView }));
    setSelectedIssue(issue);
    setModalView('fix');
  };

  const closeModal = () => {
    setPreviousState(JSON.stringify({ expandedIssue, selectedIssue, modalView }));
    setModalView(null);
    setSelectedIssue(null);
  };

  const getIssueWCAGInfo = (issue: AccessibilityIssue): WCAGInfo | undefined => {
    // Try rule ID first
    if (issue.id) {
      try {
        // First try the rule ID
        if (issue.id) {
          const ruleInfo = getWCAGInfo(issue.id);
          if (ruleInfo) return ruleInfo;
        }

        // Then try each WCAG criteria
        if (issue.wcagCriteria?.length > 0) {
          for (const criteria of issue.wcagCriteria) {
            const criteriaInfo = getWCAGInfo(criteria);
            if (criteriaInfo) return criteriaInfo;
          }
        }
      } catch (error) {
        console.error('Error getting WCAG info:', error);
      }
    }
    
    return undefined;
  };

  if (!issues || issues.length === 0) {
    return (
      <EmptyState
        title={`No ${type} Found`}
        description={type === 'issues' ? 'Great job! No accessibility issues were found.' : `No ${type} to display.`}
        icon={type === 'issues' ? <CheckCircle className="h-6 w-6 text-green-600" /> : undefined}
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => toggleAllIssues(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Expand all sections"
        >
          <Maximize2 className="w-4 h-4 mr-2" aria-hidden="true" />
          Open All
        </button>
        <button
          onClick={() => toggleAllIssues(false)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Collapse all sections"
        >
          <Minimize2 className="w-4 h-4 mr-2" aria-hidden="true" />
          Close All
        </button>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => {
          const isExpanded = expandedIssue === issue.id;
          const wcagInfo = getIssueWCAGInfo(issue);
          
          return (
            <div
              key={issue.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isExpanded ? `${getImpactColor(issue.impact)} bg-white shadow-md` : getImpactColor(issue.impact)
              }`}
            >
              <div className="flex justify-between items-start">
                <button 
                  className="flex-1 text-left flex items-center transition-colors duration-300"
                  onClick={() => toggleIssue(issue.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`issue-content-${issue.id}`}
                >
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {issue.description}
                    </h3>
                    <div className="transform transition-transform duration-300">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 ml-2 text-gray-500" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 ml-2 text-gray-500" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </button>
                {type !== 'passes' && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getImpactTagColor(issue.impact)} ml-4 transition-colors duration-300`}
                  >
                    {issue.impact}
                  </span>
                )}
              </div>
              
              <div
                id={`issue-content-${issue.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              > 
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700">Affected Elements:</h4>
                    <ul className="mt-2 space-y-1">
                      {issue.nodes.map((node, index) => (
                        <li key={index} className="text-sm text-gray-600 font-mono bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          {node}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {issue.wcagCriteria && issue.wcagCriteria.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">WCAG Criteria:</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {issue.wcagCriteria.map((criteria, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm"
                          >
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {type !== 'passes' && (
                    <>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => openIssueFix(issue)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm"
                          aria-label={`View fix for ${issue.description}`}
                        >
                          <Tool className="w-4 h-4 mr-2" aria-hidden="true" />
                          View Fix
                        </button>
                        <button
                          onClick={() => openIssueDetails(issue)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 shadow-sm"
                          aria-label={`Learn more about ${issue.description}`}
                        >
                          <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                          Learn More
                        </button>
                      </div>
                      
                      <AIRecommendations issue={issue} />
                    </>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalView !== null}
        onClose={closeModal}
        title={modalView === 'fix' ? 'How to Fix This Issue' : 'Issue Information'}
      >
        {selectedIssue && (
          <div className="space-y-6">
            {modalView === 'info' ? (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Issue Description</h4>
                  <p className="text-gray-600">{selectedIssue.description}</p>
                </div>

                {selectedIssue.wcagCriteria && selectedIssue.wcagCriteria.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">WCAG Criteria</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIssue.wcagCriteria.map((criteria, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {criteria}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Affected Elements</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedIssue.nodes.map((node, index) => (
                      <pre key={index} className="text-sm text-gray-600 font-mono overflow-x-auto">
                        {node}
                      </pre>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {(() => {
                  const wcagInfo = getIssueWCAGInfo(selectedIssue);
                  return (
                    <div>
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Success Criteria</h4>
                          <p className="text-gray-600 mb-6">
                            {wcagInfo?.successCriteria || 'Please refer to the WCAG documentation for this criterion.'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Suggested Fix</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">
                              {wcagInfo?.suggestedFix || 'Review the specific issue and apply appropriate accessibility fixes.'}
                            </p>
                            {wcagInfo?.codeExample && (
                              <pre className="mt-4 p-4 bg-gray-800 text-white rounded-lg overflow-x-auto">
                                <code>{wcagInfo.codeExample}</code>
                              </pre>
                            )}
                          </div>
                        </div>
                      </>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}