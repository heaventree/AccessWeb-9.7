import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { RoadmapFeature, FeatureStatus } from '../../data/roadmapData';

interface RoadmapFeatureEditorProps {
  feature?: RoadmapFeature;
  onSave: (feature: Partial<RoadmapFeature>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function RoadmapFeatureEditor({ feature, onSave, onCancel, isEditing = false }: RoadmapFeatureEditorProps) {
  const [formData, setFormData] = useState<Partial<RoadmapFeature>>({
    title: feature?.title || '',
    description: feature?.description || '',
    status: feature?.status || 'planned',
    priority: feature?.priority || 3,
    category: feature?.category || 'ui',
    estimatedCompletionDate: feature?.estimatedCompletionDate || '',
    completedDate: feature?.completedDate || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.priority || formData.priority < 1 || formData.priority > 5) {
      newErrors.priority = 'Priority must be between 1 (highest) and 5 (lowest)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Auto-set completed date if status is completed
      const submitData = { ...formData };
      if (submitData.status === 'completed' && !submitData.completedDate) {
        submitData.completedDate = new Date().toISOString().split('T')[0];
      }
      
      onSave(submitData);
    }
  };

  const handleChange = (field: keyof RoadmapFeature, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const statuses: FeatureStatus[] = ['planned', 'in-progress', 'completed', 'deferred'];
  const categories = ['core', 'ui', 'reporting', 'integration', 'analytics'];

  const getStatusColor = (status: FeatureStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'planned': return 'text-gray-600 bg-gray-50';
      case 'deferred': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'text-red-600 bg-red-50';
    if (priority === 2) return 'text-orange-600 bg-orange-50';
    if (priority === 3) return 'text-yellow-600 bg-yellow-50';
    if (priority === 4) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Roadmap Feature' : 'Add Roadmap Feature'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter feature title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the feature"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Status, Priority, Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority (1-5) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.priority || 3}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.priority ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.priority && (
                  <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">1 = Highest, 5 = Lowest</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estimated Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Completion Date
                </label>
                <input
                  type="date"
                  value={formData.estimatedCompletionDate || ''}
                  onChange={(e) => handleChange('estimatedCompletionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Completed Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completed Date
                </label>
                <input
                  type="date"
                  value={formData.completedDate || ''}
                  onChange={(e) => handleChange('completedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={formData.status !== 'completed'}
                />
                {formData.status !== 'completed' && (
                  <p className="text-xs text-gray-500 mt-1">Available when status is "Completed"</p>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status || 'planned')}`}>
                  {formData.status?.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority || 3)}`}>
                  Priority {formData.priority}
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {formData.category}
                </span>
              </div>
              <h5 className="font-medium text-gray-900">{formData.title || 'Feature Title'}</h5>
              <p className="text-sm text-gray-600 mt-1">{formData.description || 'Feature description'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                {isEditing ? 'Update' : 'Create'} Feature
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}