import { DebugItem, DebugItemCategory, DebugItemPriority, DebugItemStatus, DebugItemSource } from '../types/feedback';
import { v4 as uuidv4 } from 'uuid';

// Default debug items
const defaultDebugItems: DebugItem[] = [
  {
    id: '1',
    title: 'Keyboard navigation in menu not working',
    description: 'Users cannot navigate the main menu using only keyboard, which is a WCAG failure.',
    status: DebugItemStatus.OPEN,
    priority: DebugItemPriority.HIGH,
    category: DebugItemCategory.ACCESSIBILITY,
    createdAt: new Date('2023-09-01').toISOString(),
    source: DebugItemSource.FEEDBACK,
    feedbackId: 'feedback-123',
    steps: [
      'Open main navigation',
      'Try to navigate using Tab key',
      'Focus doesn\'t move through menu items correctly'
    ]
  },
  {
    id: '2',
    title: 'Color contrast too low on buttons',
    description: 'Button text does not have sufficient contrast with background, needs to be at least 4.5:1.',
    status: DebugItemStatus.IN_PROGRESS,
    priority: DebugItemPriority.MEDIUM,
    category: DebugItemCategory.ACCESSIBILITY,
    createdAt: new Date('2023-09-05').toISOString(),
    updatedAt: new Date('2023-09-10').toISOString(),
    assignedTo: 'Sarah Chen',
    source: DebugItemSource.MANUAL
  }
];

// Local storage key
const STORAGE_KEY = 'debugItems';

// Load debug items from storage or use defaults
export function getDebugItems(): DebugItem[] {
  try {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      return JSON.parse(storedItems);
    }
    return defaultDebugItems;
  } catch (error) {
    console.error('Error loading debug items:', error);
    return defaultDebugItems;
  }
}

// Save debug items to storage
export function saveDebugItems(items: DebugItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Add a new debug item
export function addDebugItem(item: Omit<DebugItem, 'id' | 'createdAt'>): DebugItem {
  const newItem: DebugItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };

  const currentItems = getDebugItems();
  saveDebugItems([...currentItems, newItem]);
  
  return newItem;
}

// Update an existing debug item
export function updateDebugItem(id: string, updates: Partial<DebugItem>): DebugItem | null {
  const items = getDebugItems();
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) return null;
  
  const updatedItem: DebugItem = {
    ...items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  items[itemIndex] = updatedItem;
  saveDebugItems(items);
  
  return updatedItem;
}

// Delete a debug item
export function deleteDebugItem(id: string): boolean {
  const items = getDebugItems();
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  saveDebugItems(filteredItems);
  return true;
}

// Utility functions for filtering and analysis
export function getItemsByStatus(status: DebugItemStatus): DebugItem[] {
  return getDebugItems().filter(item => item.status === status);
}

export function getItemsByPriority(priority: DebugItemPriority): DebugItem[] {
  return getDebugItems().filter(item => item.priority === priority);
}

export function getItemsByCategory(category: DebugItemCategory): DebugItem[] {
  return getDebugItems().filter(item => item.category === category);
}

export function getItemsBySource(source: DebugItemSource): DebugItem[] {
  return getDebugItems().filter(item => item.source === source);
}

export function getCriticalIssues(): DebugItem[] {
  return getDebugItems().filter(item => 
    item.priority === DebugItemPriority.CRITICAL && 
    (item.status === DebugItemStatus.OPEN || item.status === DebugItemStatus.IN_PROGRESS)
  );
}