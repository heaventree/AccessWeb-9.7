import React, { useState } from 'react';
import { Search, X, ExternalLink, Eye, Ear, MousePointer, Info, Filter } from 'lucide-react';
import { masterRequirements } from '../data/wcag-requirements-master';
import { motion } from 'framer-motion';

interface Requirement {
  id: string;
  description: string;
  disabilitiesAffected: ('Blind' | 'Hearing' | 'Mobility')[];
  standard: {
    name: string;
    level: 'A' | 'AA' | 'AAA';
  };
}

const DisabilityIcon = ({ type }: { type: 'Blind' | 'Hearing' | 'Mobility' }) => {
  switch (type) {
    case 'Blind':
      return <Eye className="w-4 h-4" />;
    case 'Hearing':
      return <Ear className="w-4 h-4" />;
    case 'Mobility':
      return <MousePointer className="w-4 h-4" />;
  }
};

const disabilityColors = {
  'Blind': 'bg-amber-50 text-amber-800 border-amber-200',
  'Hearing': 'bg-rose-50 text-rose-800 border-rose-200',
  'Mobility': 'bg-emerald-50 text-emerald-800 border-emerald-200'
};

const levelColors = {
  'A': 'bg-violet-50 text-violet-800 border-violet-200',
  'AA': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'AAA': 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200'
};

export function WCAGRequirementsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisabilities, setSelectedDisabilities] = useState<Set<string>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());

  const toggleDisability = (disability: string) => {
    const newSelection = new Set(selectedDisabilities);
    if (newSelection.has(disability)) {
      newSelection.delete(disability);
    } else {
      newSelection.add(disability);
    }
    setSelectedDisabilities(newSelection);
  };

  const toggleLevel = (level: string) => {
    const newSelection = new Set(selectedLevels);
    if (newSelection.has(level)) {
      newSelection.delete(level);
    } else {
      newSelection.add(level);
    }
    setSelectedLevels(newSelection);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDisabilities(new Set());
    setSelectedLevels(new Set());
  };

  const filteredRequirements = masterRequirements.filter(req => {
    const matchesSearch = searchQuery === '' || 
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDisabilities = selectedDisabilities.size === 0 || 
      req.disabilitiesAffected.some(d => selectedDisabilities.has(d));
    
    const matchesLevel = selectedLevels.size === 0 || 
      selectedLevels.has(req.standard.level);
    
    return matchesSearch && matchesDisabilities && matchesLevel;
  });

  const hasActiveFilters = searchQuery || selectedDisabilities.size > 0 || selectedLevels.size > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            WCAG Requirements
          </h1>
          <p className="text-lg text-gray-600">
            Complete list of accessibility requirements and their affected user groups
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Tags */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-500 mr-2" />
            </div>
            
            {/* Disability Filters */}
            {(['Blind', 'Hearing', 'Mobility'] as const).map(disability => (
              <button
                key={disability}
                onClick={() => toggleDisability(disability)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedDisabilities.has(disability)
                    ? disabilityColors[disability]
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <DisabilityIcon type={disability} />
                <span className="ml-1.5">{disability}</span>
              </button>
            ))}

            {/* Level Filters */}
            {(['A', 'AA', 'AAA'] as const).map(level => (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedLevels.has(level)
                    ? levelColors[level]
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Requirements Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disabilities Affected
                  </th>
                  <th scope="col" className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Standard Level
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequirements.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {req.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {req.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {req.disabilitiesAffected.map((disability) => (
                          <span
                            key={disability}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${disabilityColors[disability]}`}
                          >
                            <DisabilityIcon type={disability} />
                            <span className="ml-1.5">{disability}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium border ${levelColors[req.standard.level]}`}>
                          {req.standard.name} Level {req.standard.level}
                        </span>
                        <a
                          href={`https://www.w3.org/WAI/WCAG21/quickref/#${req.description.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}