import React, { useState, useEffect } from 'react';
import { 
  DebugItem, 
  DebugItemStatus, 
  DebugItemPriority, 
  DebugItemCategory,
  DebugItemSource
} from '../../types/feedback';
import { 
  getDebugItems, 
  getItemsBySource,
  updateDebugItem, 
  deleteDebugItem 
} from '../../data/debugData';
import { HeadingSection, Card, CardContent } from '../../components/ui';

// Status color mapping
const statusColors: Record<DebugItemStatus, string> = {
  [DebugItemStatus.OPEN]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [DebugItemStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [DebugItemStatus.RESOLVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [DebugItemStatus.WONT_FIX]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [DebugItemStatus.NEEDS_INFO]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

// Priority color mapping
const priorityColors: Record<DebugItemPriority, string> = {
  [DebugItemPriority.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [DebugItemPriority.MEDIUM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [DebugItemPriority.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [DebugItemPriority.CRITICAL]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

type FilterOption = 'all' | 'feedback' | 'manual' | 'automated';

const AdminDebug: React.FC = () => {
  const [debugItems, setDebugItems] = useState<DebugItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<DebugItemStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<DebugItemPriority | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DebugItemCategory | 'all'>('all');
  const [filterSource, setFilterSource] = useState<FilterOption>('all');
  const [editingItem, setEditingItem] = useState<DebugItem | null>(null);

  // Load debug items
  useEffect(() => {
    loadDebugItems();
  }, [filterSource]);

  const loadDebugItems = () => {
    let items: DebugItem[];
    
    if (filterSource === 'all') {
      items = getDebugItems();
    } else if (filterSource === 'feedback') {
      items = getItemsBySource(DebugItemSource.FEEDBACK);
    } else if (filterSource === 'manual') {
      items = getItemsBySource(DebugItemSource.MANUAL);
    } else { // automated
      items = getItemsBySource(DebugItemSource.AUTOMATED);
    }
    
    setDebugItems(items);
  };

  // Apply filters
  const filteredItems = debugItems.filter(item => {
    return (
      (selectedStatus === 'all' || item.status === selectedStatus) &&
      (selectedPriority === 'all' || item.priority === selectedPriority) &&
      (selectedCategory === 'all' || item.category === selectedCategory)
    );
  });

  // Handle status change
  const handleStatusChange = (id: string, status: DebugItemStatus) => {
    const updated = updateDebugItem(id, { status });
    if (updated) {
      loadDebugItems();
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteDebugItem(id);
      loadDebugItems();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeadingSection 
        title="Debug Dashboard" 
        description="Track and manage issues, bugs, and accessibility problems in your application." 
      />
      
      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <option value="automated">Automated Tests</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as DebugItemStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            {Object.values(DebugItemStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as DebugItemPriority | 'all')}
          >
            <option value="all">All Priorities</option>
            {Object.values(DebugItemPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as DebugItemCategory | 'all')}
          >
            <option value="all">All Categories</option>
            {Object.values(DebugItemCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Debug items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No debug items found with the selected filters.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <Card 
              key={item.id} 
              className={`${item.source === DebugItemSource.FEEDBACK ? 'border-pink-500 border-2' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                    {item.source === DebugItemSource.FEEDBACK && (
                      <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                        Feedback
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                
                {item.steps && item.steps.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Steps to Reproduce:</h4>
                    <ol className="list-decimal pl-5 text-sm text-gray-700 dark:text-gray-300">
                      {item.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.updatedAt && (
                      <span className="ml-4">Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as DebugItemStatus)}
                    >
                      {Object.values(DebugItemStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
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

export { AdminDebug };
export default AdminDebug;