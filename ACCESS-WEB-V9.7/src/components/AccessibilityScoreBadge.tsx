import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import type { TestResult } from '../types';

interface AccessibilityScoreBadgeProps {
  results: TestResult;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  previousScore?: number;
}

export function AccessibilityScoreBadge({ 
  results, 
  size = 'md', 
  showTrend = false, 
  previousScore 
}: AccessibilityScoreBadgeProps) {
  
  // Calculate accessibility score
  const calculateScore = () => {
    const { summary } = results;
    let score = 100;
    
    const criticalPenalty = (summary.critical || 0) * 25;
    const seriousPenalty = (summary.serious || 0) * 15;
    const moderatePenalty = (summary.moderate || 0) * 8;
    const minorPenalty = (summary.minor || 0) * 3;
    
    score = Math.max(0, score - criticalPenalty - seriousPenalty - moderatePenalty - minorPenalty);
    return Math.round(score);
  };

  const score = calculateScore();
  
  // Determine grade and status
  const getGradeAndStatus = (score: number) => {
    if (score >= 95) return { grade: 'A+', status: 'excellent', color: 'green' };
    if (score >= 90) return { grade: 'A', status: 'excellent', color: 'green' };
    if (score >= 85) return { grade: 'B+', status: 'good', color: 'blue' };
    if (score >= 80) return { grade: 'B', status: 'good', color: 'blue' };
    if (score >= 75) return { grade: 'C+', status: 'fair', color: 'yellow' };
    if (score >= 70) return { grade: 'C', status: 'fair', color: 'yellow' };
    if (score >= 60) return { grade: 'D+', status: 'poor', color: 'orange' };
    if (score >= 50) return { grade: 'D', status: 'poor', color: 'orange' };
    return { grade: 'F', status: 'critical', color: 'red' };
  };

  const { grade, status, color } = getGradeAndStatus(score);
  
  // Calculate trend if previous score is provided
  const trend = showTrend && previousScore !== undefined ? score - previousScore : null;
  
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'px-2 py-1',
      score: 'text-sm',
      grade: 'text-xs',
      icon: 'w-3 h-3',
      trend: 'text-xs'
    },
    md: {
      container: 'px-3 py-2',
      score: 'text-base',
      grade: 'text-sm',
      icon: 'w-4 h-4',
      trend: 'text-sm'
    },
    lg: {
      container: 'px-4 py-3',
      score: 'text-lg',
      grade: 'text-base',
      icon: 'w-5 h-5',
      trend: 'text-base'
    }
  };

  const config = sizeConfig[size];
  
  // Color configurations
  const colorConfig = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      score: 'text-green-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      score: 'text-blue-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      score: 'text-yellow-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      score: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      score: 'text-red-600'
    }
  };

  const colors = colorConfig[color as keyof typeof colorConfig];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        inline-flex items-center space-x-2 rounded-lg border
        ${colors.bg} ${colors.border} ${config.container}
      `}
    >
      {/* Icon */}
      <div className={colors.score}>
        {status === 'excellent' ? (
          <Award className={config.icon} />
        ) : (
          <Shield className={config.icon} />
        )}
      </div>
      
      {/* Score */}
      <div className="flex items-center space-x-1">
        <span className={`font-bold ${colors.score} ${config.score}`}>
          {score}
        </span>
        <span className={`font-medium ${colors.text} ${config.grade}`}>
          ({grade})
        </span>
      </div>
      
      {/* Trend indicator */}
      {showTrend && trend !== null && (
        <div className="flex items-center space-x-1">
          {trend > 0 ? (
            <>
              <TrendingUp className={`${config.icon} text-green-500`} />
              <span className={`${config.trend} text-green-600 font-medium`}>
                +{trend}
              </span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown className={`${config.icon} text-red-500`} />
              <span className={`${config.trend} text-red-600 font-medium`}>
                {trend}
              </span>
            </>
          ) : (
            <span className={`${config.trend} text-gray-500`}>
              No change
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Quick score calculation utility function
export function calculateAccessibilityScore(summary: TestResult['summary']): number {
  let score = 100;
  
  const criticalPenalty = (summary.critical || 0) * 25;
  const seriousPenalty = (summary.serious || 0) * 15;
  const moderatePenalty = (summary.moderate || 0) * 8;
  const minorPenalty = (summary.minor || 0) * 3;
  
  score = Math.max(0, score - criticalPenalty - seriousPenalty - moderatePenalty - minorPenalty);
  return Math.round(score);
}