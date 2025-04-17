import { RoadmapFeature, FeatureStatus, RoadmapFeatureSource } from '../types/feedback';
import { v4 as uuidv4 } from 'uuid';

// Default roadmap features
const defaultRoadmapFeatures: RoadmapFeature[] = [
  {
    id: '1',
    title: 'Keyboard Navigation Enhancement',
    description: 'Improve keyboard navigation throughout the application following WCAG 2.2 requirements.',
    status: FeatureStatus.IN_PROGRESS,
    category: 'accessibility',
    priority: 1,
    createdAt: new Date('2023-08-15').toISOString(),
    updatedAt: new Date('2023-09-01').toISOString(),
    estimatedCompletion: new Date('2023-10-15').toISOString(),
    source: RoadmapFeatureSource.FEEDBACK,
    feedbackIds: ['feedback-123', 'feedback-456']
  },
  {
    id: '2',
    title: 'High Contrast Mode',
    description: 'Add high contrast mode for users with visual impairments.',
    status: FeatureStatus.PLANNED,
    category: 'accessibility',
    priority: 2,
    createdAt: new Date('2023-08-20').toISOString(),
    estimatedCompletion: new Date('2023-11-01').toISOString(),
    dependencies: ['1'],
    source: RoadmapFeatureSource.MANUAL
  },
  {
    id: '3',
    title: 'Screen Reader Optimization',
    description: 'Optimize application for screen readers with proper ARIA attributes and semantic HTML.',
    status: FeatureStatus.PLANNED,
    category: 'accessibility',
    priority: 3,
    createdAt: new Date('2023-08-25').toISOString(),
    estimatedCompletion: new Date('2023-12-01').toISOString(),
    source: RoadmapFeatureSource.MANUAL
  }
];

// Local storage key
const STORAGE_KEY = 'roadmapFeatures';

// Load roadmap features from storage or use defaults
export function getRoadmapFeatures(): RoadmapFeature[] {
  try {
    const storedFeatures = localStorage.getItem(STORAGE_KEY);
    if (storedFeatures) {
      return JSON.parse(storedFeatures);
    }
    return defaultRoadmapFeatures;
  } catch (error) {
    console.error('Error loading roadmap features:', error);
    return defaultRoadmapFeatures;
  }
}

// Save roadmap features to storage
export function saveRoadmapFeatures(features: RoadmapFeature[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
}

// Add a new roadmap feature
export function addRoadmapFeature(feature: Omit<RoadmapFeature, 'id' | 'createdAt'>): RoadmapFeature {
  const newFeature: RoadmapFeature = {
    ...feature,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };

  const currentFeatures = getRoadmapFeatures();
  saveRoadmapFeatures([...currentFeatures, newFeature]);
  
  return newFeature;
}

// Update an existing roadmap feature
export function updateRoadmapFeature(id: string, updates: Partial<RoadmapFeature>): RoadmapFeature | null {
  const features = getRoadmapFeatures();
  const featureIndex = features.findIndex(feature => feature.id === id);
  
  if (featureIndex === -1) return null;
  
  const updatedFeature: RoadmapFeature = {
    ...features[featureIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  features[featureIndex] = updatedFeature;
  saveRoadmapFeatures(features);
  
  return updatedFeature;
}

// Delete a roadmap feature
export function deleteRoadmapFeature(id: string): boolean {
  const features = getRoadmapFeatures();
  const filteredFeatures = features.filter(feature => feature.id !== id);
  
  if (filteredFeatures.length === features.length) return false;
  
  saveRoadmapFeatures(filteredFeatures);
  return true;
}

// Utility functions for filtering and analysis
export function getFeaturesByStatus(status: FeatureStatus): RoadmapFeature[] {
  return getRoadmapFeatures().filter(feature => feature.status === status);
}

export function getFeaturesByCategory(category: string): RoadmapFeature[] {
  return getRoadmapFeatures().filter(feature => feature.category === category);
}

export function getFeaturesBySource(source: RoadmapFeatureSource): RoadmapFeature[] {
  return getRoadmapFeatures().filter(feature => feature.source === source);
}

export function getNextFeatures(limit: number = 5): RoadmapFeature[] {
  return getRoadmapFeatures()
    .filter(feature => feature.status === FeatureStatus.PLANNED)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}

export function getFeatureCategories(): string[] {
  const features = getRoadmapFeatures();
  const categories = new Set<string>();
  
  features.forEach(feature => {
    if (feature.category) {
      categories.add(feature.category);
    }
  });
  
  return Array.from(categories);
}