import React, { useState, useEffect } from 'react';
import { 
  RoadmapFeature, 
  FeatureStatus, 
  RoadmapFeatureSource 
} from '../../types/feedback';
import { 
  getRoadmapFeatures, 
  getFeaturesBySource,
  getFeaturesByStatus,
  getFeaturesByCategory, 
  getNextFeatures,
  updateRoadmapFeature, 
  deleteRoadmapFeature 
} from '../../data/roadmapData';
import { HeadingSection, Card, CardContent, Progress } from '../../components/ui';

// Status color mapping
const statusColors: Record<FeatureStatus, string> = {
  [FeatureStatus.PLANNED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [FeatureStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [FeatureStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [FeatureStatus.CANCELED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

// Priority color mapping
const getPriorityColor = (priority: number): string => {
  if (priority <= 1) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'; // Critical
  if (priority <= 3) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'; // High
  if (priority <= 6) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'; // Medium
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Low
};

type FilterOption = 'all' | 'feedback' | 'manual';

const AdminRoadmap: React.FC = () => {
  const [roadmapFeatures, setRoadmapFeatures] = useState<RoadmapFeature[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<FilterOption>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingFeature, setEditingFeature] = useState<RoadmapFeature | null>(null);

  // Load roadmap features and categories
  useEffect(() => {
    loadRoadmapFeatures();
    
    // Get unique categories
    const features = getRoadmapFeatures();
    const categorySet = new Set<string>();
    
    features.forEach(feature => {
      if (feature.category) {
        categorySet.add(feature.category);
      }
    });
    
    setCategories(Array.from(categorySet));
  }, [filterSource]);

  const loadRoadmapFeatures = () => {
    let features: RoadmapFeature[];
    
    if (filterSource === 'all') {
      features = getRoadmapFeatures();
    } else if (filterSource === 'feedback') {
      features = getFeaturesBySource(RoadmapFeatureSource.FEEDBACK);
    } else { // manual
      features = getFeaturesBySource(RoadmapFeatureSource.MANUAL);
    }
    
    setRoadmapFeatures(features);
  };

  // Apply filters
  const filteredFeatures = roadmapFeatures.filter(feature => {
    return (
      (selectedStatus === 'all' || feature.status === selectedStatus) &&
      (selectedCategory === 'all' || feature.category === selectedCategory)
    );
  });

  // Calculate progress
  const calculateProgress = (): number => {
    const total = roadmapFeatures.length;
    if (total === 0) return 0;
    
    const completed = roadmapFeatures.filter(
      feature => feature.status === FeatureStatus.COMPLETED
    ).length;
    
    return Math.round((completed / total) * 100);
  };

  // Handle status change
  const handleStatusChange = (id: string, status: FeatureStatus) => {
    const updated = updateRoadmapFeature(id, { status });
    if (updated) {
      loadRoadmapFeatures();
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      deleteRoadmapFeature(id);
      loadRoadmapFeatures();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeadingSection 
        title="Roadmap Dashboard" 
        description="Plan and track feature development and accessibility improvements." 
      />
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Overall Progress</h3>
          <span className="text-gray-600 dark:text-gray-400">{calculateProgress()}%</span>
        </div>
        <Progress 
          value={calculateProgress()} 
          max={100} 
          className="h-6" 
        />
      </div>
      
      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Filter</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value as FilterOption)}
          >
            <option value="all">All Sources</option>
            <option value="feedback">User Feedback</option>
            <option value="manual">Manual Entry</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as FeatureStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            {Object.values(FeatureStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Roadmap features */}
      <div className="space-y-4">
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No roadmap features found with the selected filters.</p>
          </div>
        ) : (
          filteredFeatures.map(feature => (
            <Card 
              key={feature.id} 
              className={`${feature.source === RoadmapFeatureSource.FEEDBACK ? 'border-pink-500 border-2' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[feature.status]}`}>
                      {feature.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(feature.priority)}`}>
                      Priority: {feature.priority}
                    </span>
                    {feature.source === RoadmapFeatureSource.FEEDBACK && (
                      <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                        Feedback-driven
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{feature.description}</p>
                
                {feature.dependencies && feature.dependencies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Dependencies:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                      {feature.dependencies.map(depId => {
                        const depFeature = roadmapFeatures.find(f => f.id === depId);
                        return (
                          <li key={depId}>
                            {depFeature ? depFeature.title : `Feature ID: ${depId}`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <span>Created: {new Date(feature.createdAt).toLocaleDateString()}</span>
                    {feature.estimatedCompletion && (
                      <span className="ml-4">
                        Target: {new Date(feature.estimatedCompletion).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                      value={feature.status}
                      onChange={(e) => handleStatusChange(feature.id, e.target.value as FeatureStatus)}
                    >
                      {Object.values(FeatureStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => handleDelete(feature.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export { AdminRoadmap };
export default AdminRoadmap;