import React from 'react';
import { addFeedbackAsDebugItem } from '../data/debugData';
import { addFeedbackAsRoadmapFeature } from '../data/roadmapData';

// A utility component to test adding items directly to the admin panels
export const AddTestItems: React.FC = () => {
  // Add a test debug item
  const addTestDebugItem = () => {
    try {
      console.log('Adding test debug item directly...');
      const itemId = addFeedbackAsDebugItem(
        'Test Debug Item',
        'This is a test debug item added directly from the AddTestItems component',
        'ui',
        'medium'
      );
      console.log('Added test debug item with ID:', itemId);
      alert('Test debug item added: ' + itemId);
    } catch (error) {
      console.error('Failed to add test debug item:', error);
      alert('Failed to add test debug item: ' + error);
    }
  };

  // Add a test roadmap feature
  const addTestRoadmapFeature = () => {
    try {
      console.log('Adding test roadmap feature directly...');
      const featureId = addFeedbackAsRoadmapFeature(
        'Test Roadmap Feature',
        'This is a test roadmap feature added directly from the AddTestItems component',
        'ui',
        3 // Medium priority
      );
      console.log('Added test roadmap feature with ID:', featureId);
      alert('Test roadmap feature added: ' + featureId);
    } catch (error) {
      console.error('Failed to add test roadmap feature:', error);
      alert('Failed to add test roadmap feature: ' + error);
    }
  };

  return (
    <div className="fixed left-4 top-4 z-50 bg-white p-2 shadow-md rounded-md border border-gray-200">
      <h3 className="text-sm font-bold mb-2">Test Admin Integration</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={addTestDebugItem}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Add Test Debug Item
        </button>
        <button
          onClick={addTestRoadmapFeature}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Add Test Roadmap Feature
        </button>
      </div>
    </div>
  );
};

export default AddTestItems;