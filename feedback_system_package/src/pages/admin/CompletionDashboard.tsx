import React, { useState, useEffect } from 'react';
import { HeadingSection, Card, CardContent, Progress } from '../../components/ui';
import { 
  DebugItemCategory, 
  DebugItemStatus, 
  FeatureStatus 
} from '../../types/feedback';
import { getDebugItems, getItemsByCategory } from '../../data/debugData';
import { getRoadmapFeatures, getFeaturesByCategory } from '../../data/roadmapData';

// Category colors
const categoryColors: Record<string, string> = {
  accessibility: 'bg-blue-600 dark:bg-blue-500',
  functionality: 'bg-green-600 dark:bg-green-500',
  performance: 'bg-purple-600 dark:bg-purple-500',
  security: 'bg-red-600 dark:bg-red-500',
  visual: 'bg-orange-600 dark:bg-orange-500',
  content: 'bg-teal-600 dark:bg-teal-500',
  other: 'bg-gray-600 dark:bg-gray-500'
};

interface CategoryCompletion {
  category: string;
  bugsFixed: number;
  totalBugs: number;
  featuresCompleted: number;
  totalFeatures: number;
  overallPercentage: number;
}

// Helper to convert category names to friendly format
const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const CompletionDashboard: React.FC = () => {
  const [categoryCompletions, setCategoryCompletions] = useState<CategoryCompletion[]>([]);
  const [overallCompletion, setOverallCompletion] = useState(0);

  useEffect(() => {
    calculateCompletions();
  }, []);

  const calculateCompletions = () => {
    const debugItems = getDebugItems();
    const roadmapFeatures = getRoadmapFeatures();
    
    // Get all unique categories
    const categorySet = new Set<string>();
    
    debugItems.forEach(item => categorySet.add(item.category));
    roadmapFeatures.forEach(feature => {
      if (feature.category) categorySet.add(feature.category);
    });
    
    // Calculate completion for each category
    const completions: CategoryCompletion[] = Array.from(categorySet).map(category => {
      const categoryBugs = debugItems.filter(item => item.category === category);
      const categoryFeatures = roadmapFeatures.filter(feature => feature.category === category);
      
      const fixedBugs = categoryBugs.filter(
        bug => bug.status === DebugItemStatus.RESOLVED
      ).length;
      
      const completedFeatures = categoryFeatures.filter(
        feature => feature.status === FeatureStatus.COMPLETED
      ).length;
      
      const bugPercentage = categoryBugs.length > 0 
        ? (fixedBugs / categoryBugs.length) * 100 
        : 100;
        
      const featurePercentage = categoryFeatures.length > 0 
        ? (completedFeatures / categoryFeatures.length) * 100 
        : 100;
      
      // Calculate weighted average (bugs 40%, features 60%)
      const overallPercentage = Math.round((bugPercentage * 0.4) + (featurePercentage * 0.6));
      
      return {
        category,
        bugsFixed: fixedBugs,
        totalBugs: categoryBugs.length,
        featuresCompleted: completedFeatures,
        totalFeatures: categoryFeatures.length,
        overallPercentage
      };
    });
    
    // Sort by completion percentage (descending)
    completions.sort((a, b) => b.overallPercentage - a.overallPercentage);
    setCategoryCompletions(completions);
    
    // Calculate overall completion
    const totalBugs = debugItems.length;
    const fixedBugs = debugItems.filter(
      bug => bug.status === DebugItemStatus.RESOLVED
    ).length;
    
    const totalFeatures = roadmapFeatures.length;
    const completedFeatures = roadmapFeatures.filter(
      feature => feature.status === FeatureStatus.COMPLETED
    ).length;
    
    const bugsPercentage = totalBugs > 0 ? (fixedBugs / totalBugs) * 100 : 100;
    const featuresPercentage = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 100;
    
    // Weighted average
    const overall = Math.round((bugsPercentage * 0.4) + (featuresPercentage * 0.6));
    setOverallCompletion(overall);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeadingSection 
        title="Completion Dashboard" 
        description="Track the overall progress of your project across different categories." 
      />
      
      {/* Overall progress */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Overall Project Completion</h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overallCompletion}%</span>
          </div>
          <Progress 
            value={overallCompletion} 
            max={100} 
            className="h-8" 
            barClassName="bg-gradient-to-r from-blue-500 to-purple-500" 
          />
        </CardContent>
      </Card>
      
      {/* Category breakdown */}
      <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {categoryCompletions.map(category => (
          <Card key={category.category}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold">{formatCategoryName(category.category)}</h4>
                <span className="text-xl font-semibold">{category.overallPercentage}%</span>
              </div>
              
              <Progress 
                value={category.overallPercentage} 
                max={100} 
                className="h-6 mb-4" 
                barClassName={categoryColors[category.category] || 'bg-blue-600 dark:bg-blue-500'} 
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bugs Fixed</span>
                    <span className="font-medium">
                      {category.bugsFixed} / {category.totalBugs}
                    </span>
                  </div>
                  <Progress 
                    value={category.totalBugs > 0 ? (category.bugsFixed / category.totalBugs) * 100 : 100} 
                    max={100} 
                    className="h-2 mt-1" 
                    barClassName="bg-red-500 dark:bg-red-400" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Features Completed</span>
                    <span className="font-medium">
                      {category.featuresCompleted} / {category.totalFeatures}
                    </span>
                  </div>
                  <Progress 
                    value={category.totalFeatures > 0 ? (category.featuresCompleted / category.totalFeatures) * 100 : 100} 
                    max={100} 
                    className="h-2 mt-1" 
                    barClassName="bg-green-500 dark:bg-green-400" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Key metrics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">Key Metrics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Categories</div>
              <div className="text-2xl font-bold">{categoryCompletions.length}</div>
            </div>
            
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400">Categories 100% Complete</div>
              <div className="text-2xl font-bold">
                {categoryCompletions.filter(c => c.overallPercentage === 100).length}
              </div>
            </div>
            
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Categories In Progress</div>
              <div className="text-2xl font-bold">
                {categoryCompletions.filter(c => c.overallPercentage > 0 && c.overallPercentage < 100).length}
              </div>
            </div>
            
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
              <div className="text-sm text-red-600 dark:text-red-400">Categories Not Started</div>
              <div className="text-2xl font-bold">
                {categoryCompletions.filter(c => c.overallPercentage === 0).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { CompletionDashboard };
export default CompletionDashboard;