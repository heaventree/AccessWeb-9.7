import React from 'react';

interface Region {
  id: string;
  name: string;
  standards: string[];
  color: string;
}

const regions: Region[] = [
  {
    id: 'eu',
    name: 'EU',
    standards: ['EN 301 549', 'EAA', 'WCAG 2.1', 'WCAG 2.2'],
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'uk',
    name: 'UK',
    standards: ['WCAG 2.1', 'WCAG 2.2', 'GDS', 'EN 301 549'],
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  {
    id: 'usa',
    name: 'USA',
    standards: ['ADA', 'Section 508', 'WCAG 2.1', 'WCAG 2.2'],
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'canada',
    name: 'Canada',
    standards: ['AODA', 'WCAG 2.1', 'WCAG 2.2'],
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  {
    id: 'australia',
    name: 'Australia',
    standards: ['DDA', 'WCAG 2.1', 'WCAG 2.2'],
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'japan',
    name: 'Japan',
    standards: ['JIS X 8341-3', 'WCAG 2.1', 'WCAG 2.2'],
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'global',
    name: 'Global',
    standards: ['WCAG 2.1', 'WCAG 2.2', 'ISO/IEC 40500'],
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
];

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-7 gap-2 mb-6">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onRegionChange(region.id)}
            className={`py-2 px-3 rounded-lg border transition-all duration-200 text-center ${
              selectedRegion === region.id
                ? `${region.color} shadow-sm border-transparent`
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-medium">{region.name}</span>
          </button>
        ))}
      </div>

      {/* Standards Display */}
      {selectedRegion && (
        <div className="flex justify-center flex-wrap gap-2">
          {regions
            .find(r => r.id === selectedRegion)
            ?.standards.map((standard, index) => {
              // Get color based on standard type with highly distinctive colors
              let colorClass = '';
              if (standard.includes('WCAG 2.1')) {
                colorClass = 'bg-blue-500 text-white border-blue-700';
              } else if (standard.includes('WCAG 2.2')) {
                colorClass = 'bg-purple-600 text-white border-purple-800';
              } else if (standard.includes('ADA')) {
                colorClass = 'bg-green-500 text-white border-green-700';
              } else if (standard.includes('508')) {
                colorClass = 'bg-orange-500 text-white border-orange-700';
              } else if (standard.includes('EN')) {
                colorClass = 'bg-red-500 text-white border-red-700';
              } else if (standard.includes('EAA')) {
                colorClass = 'bg-yellow-500 text-yellow-900 border-yellow-700';
              } else if (standard.includes('JIS')) {
                colorClass = 'bg-pink-500 text-white border-pink-700';
              } else if (standard.includes('ISO')) {
                colorClass = 'bg-indigo-500 text-white border-indigo-700';
              } else if (standard.includes('AODA')) {
                colorClass = 'bg-red-600 text-white border-red-800';
              } else if (standard.includes('DDA')) {
                colorClass = 'bg-emerald-600 text-white border-emerald-800';
              } else if (standard.includes('GDS')) {
                colorClass = 'bg-fuchsia-600 text-white border-fuchsia-800';
              } else {
                colorClass = 'bg-gray-600 text-white border-gray-800';
              }

              return (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${colorClass}`}
                >
                  {standard}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
}