import express from 'express';
import { databaseService } from '../../services/databaseService';

const router = express.Router();

/**
 * Get all published pages
 * @route GET /api/cms/pages
 */
router.get('/pages', async (req, res) => {
  try {
    const pages = await databaseService.getPublishedPages();
    res.json({ data: pages });
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get a page by slug
 * @route GET /api/cms/pages/:slug
 */
router.get('/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  
  try {
    const page = await databaseService.getPageWithRelations(slug);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ data: page });
  } catch (error: any) {
    console.error(`Error fetching page ${slug}:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get navigation structure
 * @route GET /api/cms/navigation
 */
router.get('/navigation', async (req, res) => {
  try {
    const navigation = await databaseService.getNavigationWithStructure();
    res.json({ data: { items: navigation } });
  } catch (error: any) {
    console.error('Error fetching navigation:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get an asset by ID
 * @route GET /api/cms/assets/:id
 */
router.get('/assets/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const asset = await databaseService.getAssetById(Number(id));
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json({ data: asset });
  } catch (error: any) {
    console.error(`Error fetching asset ${id}:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get all assets
 * @route GET /api/cms/assets
 */
router.get('/assets', async (req, res) => {
  try {
    const assets = await databaseService.getAllAssets();
    res.json({ data: assets });
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Export router
export default router;