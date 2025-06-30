import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check admin access
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    // console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authentication check failed' });
  }
};

// Helper function to read and write data files
async function readDataFile(filename) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    // console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read ${filename}`);
  }
}

async function writeDataFile(filename, content) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    // console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write ${filename};
  }
}

// Get debug items
router.get('/debug', requireAdmin, async (req, res) => {
  try {
    const content = await readDataFile('debugData.ts');
    
    // Extract debug items array from the file
    const itemsMatch = content.match(/export const debugItems: DebugItem\[\] = (\[[\s\S]*?\]);/);
    if (!itemsMatch) {
      return res.status(500).json({ error: 'Could not parse debug items' });
    }

    // Parse the items (simplified parsing)
    const itemsText = itemsMatch[1];
    
    res.json({
      success: true,
      message: 'Debug items retrieved successfully',
      data: { content: itemsText }
    });
  } catch (error) {
    // console.error('Error getting debug items:', error);
    res.status(500).json({ error: 'Failed to get debug items' });
  }
});

// Update debug item
router.put('/debug/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const content = await readDataFile('debugData.ts');
    
    // Find and update the specific item
    const updatedContent = updateDebugItemInContent(content, id, updates);
    
    await writeDataFile('debugData.ts', updatedContent);

    res.json({
      success: true,
      message: 'Debug item updated successfully',
      data: { id, updates }
    });
  } catch (error) {
    // console.error('Error updating debug item:', error);
    res.status(500).json({ error: 'Failed to update debug item' });
  }
});

// Add new debug item
router.post('/debug', requireAdmin, async (req, res) => {
  try {
    const newItem = {
      id: `debug-${Date.now()}`,
      dateIdentified: new Date().toISOString().split('T')[0],
      source: 'manual',
      ...req.body
    };

    const content = await readDataFile('debugData.ts');
    const updatedContent = addDebugItemToContent(content, newItem);
    
    await writeDataFile('debugData.ts', updatedContent);

    res.json({
      success: true,
      message: 'Debug item created successfully',
      data: newItem
    });
  } catch (error) {
    // console.error('Error creating debug item:', error);
    res.status(500).json({ error: 'Failed to create debug item' });
  }
});

// Get roadmap features
router.get('/roadmap', requireAdmin, async (req, res) => {
  try {
    const content = await readDataFile('roadmapData.ts');
    
    // Extract roadmap features array from the file
    const featuresMatch = content.match(/export const roadmapFeatures: RoadmapFeature\[\] = (\[[\s\S]*?\]);/);
    if (!featuresMatch) {
      return res.status(500).json({ error: 'Could not parse roadmap features' });
    }

    const featuresText = featuresMatch[1];
    
    res.json({
      success: true,
      message: 'Roadmap features retrieved successfully',
      data: { content: featuresText }
    });
  } catch (error) {
    // console.error('Error getting roadmap features:', error);
    res.status(500).json({ error: 'Failed to get roadmap features' });
  }
});

// Update roadmap feature
router.put('/roadmap/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const content = await readDataFile('roadmapData.ts');
    const updatedContent = updateRoadmapFeatureInContent(content, id, updates);
    
    await writeDataFile('roadmapData.ts', updatedContent);

    res.json({
      success: true,
      message: 'Roadmap feature updated successfully',
      data: { id, updates }
    });
  } catch (error) {
    // console.error('Error updating roadmap feature:', error);
    res.status(500).json({ error: 'Failed to update roadmap feature' });
  }
});

// Add new roadmap feature
router.post('/roadmap', requireAdmin, async (req, res) => {
  try {
    const newFeature = {
      id: `feature-${Date.now()}`,
      source: 'manual',
      ...req.body
    };

    const content = await readDataFile('roadmapData.ts');
    const updatedContent = addRoadmapFeatureToContent(content, newFeature);
    
    await writeDataFile('roadmapData.ts', updatedContent);

    res.json({
      success: true,
      message: 'Roadmap feature created successfully',
      data: newFeature
    });
  } catch (error) {
    // console.error('Error creating roadmap feature:', error);
    res.status(500).json({ error: 'Failed to create roadmap feature' });
  }
});

// Helper functions to update content
function updateDebugItemInContent(content, itemId, updates) {
  // Simple regex-based update for the specific item
  const itemRegex = new RegExp(`(\\{[^}]*id:\\s*['"\`]${itemId}['"\`][^}]*\\})`, 'gs');
  
  return content.replace(itemRegex, (match) => {
    let updatedItem = match;
    
    // Update each field in the updates object
    Object.entries(updates).forEach(([key, value]) => {
      const fieldRegex = new RegExp(`(${key}:\\s*)([^,}]+)`, 'g');
      const newValue = typeof value === 'string' ? `'${value}'` : value;
      updatedItem = updatedItem.replace(fieldRegex, `$1${newValue};
    });
    
    return updatedItem;
  });
}

function addDebugItemToContent(content, newItem) {
  const itemsEndRegex = /(\];)/;
  const newItemString = formatDebugItemForFile(newItem);
  
  return content.replace(itemsEndRegex, `,\n  ${newItemString}\n$1;
}

function updateRoadmapFeatureInContent(content, featureId, updates) {
  const featureRegex = new RegExp(`(\\{[^}]*id:\\s*['"\`]${featureId}['"\`][^}]*\\})`, 'gs');
  
  return content.replace(featureRegex, (match) => {
    let updatedFeature = match;
    
    Object.entries(updates).forEach(([key, value]) => {
      const fieldRegex = new RegExp(`(${key}:\\s*)([^,}]+)`, 'g');
      const newValue = typeof value === 'string' ? `'${value}'` : value;
      updatedFeature = updatedFeature.replace(fieldRegex, `$1${newValue};
    });
    
    return updatedFeature;
  });
}

function addRoadmapFeatureToContent(content, newFeature) {
  const featuresEndRegex = /(\];)/;
  const newFeatureString = formatRoadmapFeatureForFile(newFeature);
  
  return content.replace(featuresEndRegex, `,\n  ${newFeatureString}\n$1;
}

function formatDebugItemForFile(item) {
  return `{
    id: '${item.id}',
    title: '${item.title}',
    description: '${item.description}',
    category: '${item.category}',
    status: '${item.status}',
    priority: '${item.priority}',
    dateIdentified: '${item.dateIdentified}',
    source: '${item.source}'${item.assignedTo ? `,\n    assignedTo: '${item.assignedTo}'` : ''}${item.notes ? `,\n    notes: '${item.notes}'` : ''}
  }`;
}

function formatRoadmapFeatureForFile(feature) {
  return `{
    id: '${feature.id}',
    title: '${feature.title}',
    description: '${feature.description}',
    status: '${feature.status}',
    priority: ${feature.priority},
    category: '${feature.category}',
    source: '${feature.source}'${feature.estimatedCompletionDate ? `,\n    estimatedCompletionDate: '${feature.estimatedCompletionDate}'` : ''}${feature.completedDate ? `,\n    completedDate: '${feature.completedDate}'` : ''}
  }`;
}

export default router;