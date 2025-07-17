import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Award,
  BarChart3,
  PieChart,
  Activity,
  Shield
} from 'lucide-react';
import type { TestResult } from '../types';

interface AccessibilityScoreVisualizationProps {
  results: TestResult;
  showDetails?: boolean;
}

interface ScoreBreakdown {
  overall: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

export function AccessibilityScoreVisualization({ results, showDetails = true }: AccessibilityScoreVisualizationProps) {
  // Calculate accessibility score based on issues
  const calculateAccessibilityScore = (): ScoreBreakdown => {
    const { summary } = results;
    
    // Base score starts at 100
    let score = 100;
    
    // Deduct points for issues (weighted by severity)
    const criticalPenalty = (summary.critical || 0) * 25;
    const seriousPenalty = (summary.serious || 0) * 15;
    const moderatePenalty = (summary.moderate || 0) * 8;
    const minorPenalty = (summary.minor || 0) * 3;
    
    score = Math.max(0, score - criticalPenalty - seriousPenalty - moderatePenalty - minorPenalty);
    
    // Calculate individual category scores
    const criticalScore = Math.max(0, 100 - (summary.critical || 0) * 30);
    const seriousScore = Math.max(0, 100 - (summary.serious || 0) * 20);
    const moderateScore = Math.max(0, 100 - (summary.moderate || 0) * 10);
    const minorScore = Math.max(0, 100 - (summary.minor || 0) * 5);
    
    // Determine grade and status
    let grade: ScoreBreakdown['grade'];
    let status: ScoreBreakdown['status'];
    
    if (score >= 95) {
      grade = 'A+';
      status = 'excellent';
    } else if (score >= 90) {
      grade = 'A';
      status = 'excellent';
    } else if (score >= 85) {
      grade = 'B+';
      status = 'good';
    } else if (score >= 80) {
      grade = 'B';
      status = 'good';
    } else if (score >= 75) {
      grade = 'C+';
      status = 'fair';
    } else if (score >= 70) {
      grade = 'C';
      status = 'fair';
    } else if (score >= 60) {
      grade = 'D+';
      status = 'poor';
    } else if (score >= 50) {
      grade = 'D';
      status = 'poor';
    } else {
      grade = 'F';
      status = 'critical';
    }
    
    return {
      overall: Math.round(score),
      critical: Math.round(criticalScore),
      serious: Math.round(seriousScore),
      moderate: Math.round(moderateScore),
      minor: Math.round(minorScore),
      grade,
      status
    };
  };

  const scoreData = calculateAccessibilityScore();
  
  // Get color scheme based on status
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'excellent':
        return {
          primary: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          ring: 'ring-green-500',
          gradient: 'from-green-500 to-emerald-600'
        };
      case 'good':
        return {
          primary: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          ring: 'ring-blue-500',
          gradient: 'from-blue-500 to-cyan-600'
        };
      case 'fair':
        return {
          primary: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          ring: 'ring-yellow-500',
          gradient: 'from-yellow-500 to-orange-500'
        };
      case 'poor':
        return {
          primary: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          ring: 'ring-orange-500',
          gradient: 'from-orange-500 to-red-500'
        };
      case 'critical':
        return {
          primary: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          ring: 'ring-red-500',
          gradient: 'from-red-500 to-red-700'
        };
      default:
        return {
          primary: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          ring: 'ring-gray-500',
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const colors = getStatusColors(scoreData.status);
  
  // Calculate total issues for comparison
  const totalIssues = (results.summary.critical || 0) + 
                     (results.summary.serious || 0) + 
                     (results.summary.moderate || 0) + 
                     (results.summary.minor || 0);

  // Score progress circle component
  const ScoreCircle = ({ score, size = 120 }: { score: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={colors.primary}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div 
              className={`text-2xl font-bold ${colors.primary}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {score}
            </motion.div>
            <div className="text-xs text-gray-500 font-medium">SCORE</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className={`w-6 h-6 ${colors.primary} mr-3`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Accessibility Score</h3>
              <p className="text-sm text-gray-600">Overall website accessibility rating</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div 
              className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.primary} ${colors.border} border`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Grade {scoreData.grade}
            </motion.div>
            {scoreData.status === 'excellent' && <Award className="w-5 h-5 text-yellow-500" />}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <ScoreCircle score={scoreData.overall} size={140} />
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h4 className={`text-xl font-bold ${colors.primary} capitalize`}>
                {scoreData.status} Accessibility
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {totalIssues === 0 
                  ? "No accessibility issues detected" 
                  : `${totalIssues} total issue${totalIssues !== 1 ? 's' : ''} found`
                }
              </p>
            </motion.div>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Category Breakdown */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Category Breakdown
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <ScoreCircle score={scoreData.critical} size={64} />
                  </div>
                  <div className="text-xs font-medium text-gray-700">Critical</div>
                  <div className="text-xs text-gray-500">{results.summary.critical || 0} issues</div>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <ScoreCircle score={scoreData.serious} size={64} />
                  </div>
                  <div className="text-xs font-medium text-gray-700">Serious</div>
                  <div className="text-xs text-gray-500">{results.summary.serious || 0} issues</div>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <ScoreCircle score={scoreData.moderate} size={64} />
                  </div>
                  <div className="text-xs font-medium text-gray-700">Moderate</div>
                  <div className="text-xs text-gray-500">{results.summary.moderate || 0} issues</div>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <ScoreCircle score={scoreData.minor} size={64} />
                  </div>
                  <div className="text-xs font-medium text-gray-700">Minor</div>
                  <div className="text-xs text-gray-500">{results.summary.minor || 0} issues</div>
                </motion.div>
              </div>
            </div>

            {/* Compliance Status */}
            <motion.div 
              className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <Shield className={`w-5 h-5 ${colors.primary} mr-3 mt-0.5`} />
                  <div>
                    <h5 className="font-medium text-gray-900">WCAG Compliance Status</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {scoreData.status === 'excellent' 
                        ? "Your website meets accessibility standards with minimal or no issues."
                        : scoreData.status === 'good'
                        ? "Your website has good accessibility with some areas for improvement."
                        : scoreData.status === 'fair'
                        ? "Your website has moderate accessibility issues that should be addressed."
                        : scoreData.status === 'poor'
                        ? "Your website has significant accessibility barriers that need immediate attention."
                        : "Your website has critical accessibility issues that prevent access for many users."
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {scoreData.status === 'excellent' || scoreData.status === 'good' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <p className="text-xs text-gray-500">
                Scores are calculated based on issue severity and count. 
                <br />
                Focus on critical and serious issues first for maximum impact.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}