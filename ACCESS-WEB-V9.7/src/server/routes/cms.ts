import express from 'express';
import { databaseService } from '../../services/databaseService';

const router = express.Router();

/**
 * Get dashboard statistics
 * @route GET /api/cms/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const allPages = await databaseService.getAllPages();
    const publishedPages = allPages.filter(page => !page.draftStatus && page.publishedAt);
    const draftPages = allPages.filter(page => page.draftStatus || !page.publishedAt);
    
    res.json({
      totalPages: allPages.length,
      publishedPages: publishedPages.length,
      draftPages: draftPages.length
    });
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get recent pages
 * @route GET /api/cms/pages/recent
 */
router.get('/pages/recent', async (req, res) => {
  try {
    const allPages = await databaseService.getAllPages();
    // Sort by updated date and take the 5 most recent
    const recentPages = allPages
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    
    res.json({ data: recentPages });
  } catch (error: any) {
    console.error('Error fetching recent pages:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get all published pages
 * @route GET /api/cms/pages
 */
router.get('/pages', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const pages = includeAll ? 
      await databaseService.getAllPages() : 
      await databaseService.getPublishedPages();
      
    res.json({ data: pages });
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get a page by ID (for preview and editing)
 * @route GET /api/cms/pages/id/:id
 */
router.get('/pages/id/:id', async (req, res) => {
  const { id } = req.params;
  const isPreview = req.query.preview === 'true';
  
  try {
    const page = await databaseService.getPageById(Number(id));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // For non-preview requests, don't return draft pages
    if (!isPreview && page.draftStatus) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get sections and SEO data
    const sections = await databaseService.getSectionsByPageId(page.id);
    const seo = await databaseService.getSEOMetadataByPageId(page.id);
    
    res.json({ 
      data: {
        ...page,
        sections,
        seo
      } 
    });
  } catch (error: any) {
    console.error(`Error fetching page ${id}:`, error);
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
    
    // Don't return draft pages when accessed by slug
    if (page.draftStatus) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ data: page });
  } catch (error: any) {
    console.error(`Error fetching page ${slug}:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Create a new page
 * @route POST /api/cms/pages
 */
router.post('/pages', async (req, res) => {
  try {
    const { title, slug, layout, draftStatus, sections = [], seo } = req.body;
    
    // Create the page
    const newPage = await databaseService.createPage({
      title,
      slug,
      layout,
      draftStatus,
      publishedAt: !draftStatus ? new Date() : null,
      createdById: 1, // In a real app, would be the logged-in user ID
    });
    
    // Create SEO metadata
    if (seo) {
      await databaseService.createSEOMetadata({
        pageId: newPage.id,
        ...seo
      });
    }
    
    // Create sections
    if (sections.length > 0) {
      for (const [index, section] of sections.entries()) {
        await databaseService.createSection({
          pageId: newPage.id,
          type: section.type,
          content: typeof section.content === 'string' ? section.content : JSON.stringify(section.content),
          order: index
        });
      }
    }
    
    res.status(201).json({ 
      message: 'Page created successfully',
      data: newPage
    });
  } catch (error: any) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Update an existing page
 * @route PUT /api/cms/pages/:id
 */
router.put('/pages/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { title, slug, layout, draftStatus, sections = [], seo } = req.body;
    
    // Update the page
    const updatedPage = await databaseService.updatePage(Number(id), {
      title,
      slug,
      layout,
      draftStatus,
      publishedAt: !draftStatus ? new Date() : null,
      updatedAt: new Date(),
    });
    
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Update SEO metadata if it exists, or create it if it doesn't
    const existingSEO = await databaseService.getSEOMetadataByPageId(Number(id));
    
    if (existingSEO) {
      await databaseService.updateSEOMetadata(existingSEO.id, seo);
    } else if (seo) {
      await databaseService.createSEOMetadata({
        pageId: Number(id),
        ...seo
      });
    }
    
    // Update sections: delete existing sections and create new ones
    // In a real app, you'd use a more sophisticated diff algorithm
    const existingSections = await databaseService.getSectionsByPageId(Number(id));
    
    // Delete existing sections
    for (const section of existingSections) {
      await databaseService.deleteSection(section.id);
    }
    
    // Create new sections
    for (const [index, section] of sections.entries()) {
      await databaseService.createSection({
        pageId: Number(id),
        type: section.type,
        content: typeof section.content === 'string' ? section.content : JSON.stringify(section.content),
        order: index
      });
    }
    
    res.json({ 
      message: 'Page updated successfully',
      data: updatedPage
    });
  } catch (error: any) {
    console.error(`Error updating page ${id}:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Delete a page
 * @route DELETE /api/cms/pages/:id
 */
router.delete('/pages/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Delete related sections and SEO metadata first
    const sections = await databaseService.getSectionsByPageId(Number(id));
    for (const section of sections) {
      await databaseService.deleteSection(section.id);
    }
    
    const seo = await databaseService.getSEOMetadataByPageId(Number(id));
    if (seo) {
      await databaseService.updateSEOMetadata(seo.id, {});
    }
    
    // Delete the page
    const success = await databaseService.deletePage(Number(id));
    
    if (!success) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ message: 'Page deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting page ${id}:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Publish a page (change from draft to published)
 * @route POST /api/cms/pages/:id/publish
 */
router.post('/pages/:id/publish', async (req, res) => {
  const { id } = req.params;
  
  try {
    const updatedPage = await databaseService.updatePage(Number(id), {
      draftStatus: false,
      publishedAt: new Date(),
      updatedAt: new Date(),
    });
    
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ 
      message: 'Page published successfully',
      data: updatedPage
    });
  } catch (error: any) {
    console.error(`Error publishing page ${id}:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Unpublish a page (change from published to draft)
 * @route POST /api/cms/pages/:id/unpublish
 */
router.post('/pages/:id/unpublish', async (req, res) => {
  const { id } = req.params;
  
  try {
    const updatedPage = await databaseService.updatePage(Number(id), {
      draftStatus: true,
      updatedAt: new Date(),
    });
    
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ 
      message: 'Page unpublished successfully',
      data: updatedPage
    });
  } catch (error: any) {
    console.error(`Error unpublishing page ${id}:`, error);
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
 * Update navigation structure
 * @route PUT /api/cms/navigation
 */
router.put('/navigation', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid navigation structure' });
    }
    
    // In a real app, you'd use a more sophisticated update algorithm
    // For this example, we'll just delete all existing navigation items and create new ones
    const existingItems = await databaseService.getNavigationItems();
    
    // Delete existing navigation items
    for (const item of existingItems) {
      await databaseService.deleteNavigationItem(item.id);
    }
    
    // Create new navigation items
    const createNavigationItems = async (items: any[], parentId?: number) => {
      for (const item of items) {
        const newItem = await databaseService.createNavigationItem({
          label: item.label,
          url: item.url,
          pageId: item.pageId,
          parentId,
          target: item.target || '_self',
          icon: item.icon,
          isButton: item.isButton || false,
          order: item.order || 0,
        });
        
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          await createNavigationItems(item.children, newItem.id);
        }
      }
    };
    
    await createNavigationItems(items);
    
    res.json({ message: 'Navigation updated successfully' });
  } catch (error: any) {
    console.error('Error updating navigation:', error);
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