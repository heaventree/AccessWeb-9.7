import React from 'react';
import { AlertTriangle, AlertOctagon, AlertCircle, Info, CheckCircle, AlertCircle as Warning } from 'lucide-react';
import type { TestResult } from '../types';

interface ResultsSummaryProps {
  results: TestResult;
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  const { summary } = results;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div className="bg-red-50 p-3 rounded-lg">
        <div className="flex items-center">
          <AlertOctagon className="w-5 h-5 text-red-600 mr-2" />
          <h4 className="text-red-800 text-sm font-semibold">Critical</h4>
        </div>
        <p className="text-xl font-bold text-red-600 mt-1">{summary.critical}</p>
      </div>
      
      <div className="bg-orange-50 p-3 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
          <h4 className="text-orange-800 text-sm font-semibold">Serious</h4>
        </div>
        <p className="text-xl font-bold text-orange-600 mt-1">{summary.serious}</p>
      </div>
      
      <div className="bg-yellow-50 p-3 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <h4 className="text-yellow-800 text-sm font-semibold">Moderate</h4>
        </div>
        <p className="text-xl font-bold text-yellow-600 mt-1">{summary.moderate}</p>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center">
          <Info className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="text-blue-800 text-sm font-semibold">Minor</h4>
        </div>
        <p className="text-xl font-bold text-blue-600 mt-1">{summary.minor}</p>
      </div>

      <div className="bg-emerald-50 p-3 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
          <h4 className="text-emerald-800 text-sm font-semibold">Passed</h4>
        </div>
        <p className="text-xl font-bold text-emerald-600 mt-1">{summary.passes}</p>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg">
        <div className="flex items-center">
          <Warning className="w-5 h-5 text-amber-600 mr-2" />
          <h4 className="text-amber-800 text-sm font-semibold">Warnings</h4>
        </div>
        <p className="text-xl font-bold text-amber-600 mt-1">{summary.warnings}</p>
      </div>
    </div>
  );
}