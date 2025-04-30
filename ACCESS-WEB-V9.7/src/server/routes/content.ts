import { Router, Request, Response } from 'express';
import { and, eq, like, desc, SQL } from 'drizzle-orm';
import slugify from 'slugify';
import { db } from '../db';
import * as schema from '../../shared/schema';
import { storage } from '../storage';
import { authenticate, authorize } from '../middleware/authMiddleware';

export function registerContentRoutes(app: any, apiPrefix: string): void {
  const router = Router();

  /**
   * @route   GET /api/v1/content
   * @desc    Get all content with optional filtering
   * @access  Public/Private (depending on content status)
   */
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { 
        type = 'post', 
        status = 'published',
        category,
        tag,
        author,
        search,
        limit = 10,
        offset = 0 
      } = req.query;

      // Base query conditions
      const conditions: SQL[] = [
        eq(schema.content.type, type as string)
      ];

      // Only show published content to non-authenticated users
      const isAdmin = (req as any).user?.role === 'admin';
      if (!isAdmin && status !== 'all') {
        conditions.push(eq(schema.content.status, 'published'));
      } else if (status !== 'all') {
        conditions.push(eq(schema.content.status, status as string));
      }

      // Search by title or excerpt
      if (search) {
        conditions.push(
          like(schema.content.title, `%${search}%`)
        );
      }

      // Filter by author
      if (author) {
        conditions.push(
          eq(schema.content.authorId, parseInt(author as string))
        );
      }

      // Execute the query
      const content = await db.select()
        .from(schema.content)
        .where(and(...conditions))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string))
        .orderBy(desc(schema.content.publishedAt));

      // Get total count for pagination
      const [{ count }] = await db.select({
        count: count()
      })
      .from(schema.content)
      .where(and(...conditions));

      res.json({ 
        content, 
        pagination: {
          total: count,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error) {
      console.error('Get content error:', error);
      res.status(500).json({ error: 'Failed to get content' });
    }
  });

  /**
   * @route   GET /api/v1/content/:slug
   * @desc    Get content by slug
   * @access  Public/Private (depending on content status)
   */
  router.get('/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const content = await storage.getContentBySlug(slug);
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      // Only show published content to non-authenticated users
      const isAdmin = (req as any).user?.role === 'admin';
      const isAuthor = (req as any).user?.id === content.authorId;
      
      if (content.status !== 'published' && !isAdmin && !isAuthor) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      res.json({ content });
    } catch (error) {
      console.error('Get content error:', error);
      res.status(500).json({ error: 'Failed to get content' });
    }
  });

  /**
   * @route   POST /api/v1/content
   * @desc    Create new content
   * @access  Private
   */
  router.post('/', authenticate, async (req: Request, res: Response) => {
    try {
      const { 
        title, 
        body, 
        excerpt, 
        type = 'post', 
        status = 'draft',
        featuredImage,
        metaTitle,
        metaDescription,
        tags = []
      } = req.body;
      
      if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
      }
      
      // Generate slug from title
      let slug = slugify(title, { lower: true, strict: true });
      
      // Check if slug exists
      const existingContent = await storage.getContentBySlug(slug);
      if (existingContent) {
        // Add random suffix to slug
        slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
      }
      
      // Get current user
      const user = (req as any).user;
      
      // Create content
      const newContent = await storage.createContent({
        title,
        slug,
        body,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
        authorId: user.id,
        status,
        type,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || null,
        tags: tags as string[],
        publishedAt: status === 'published' ? new Date() : null
      });
      
      res.status(201).json({ content: newContent });
    } catch (error) {
      console.error('Create content error:', error);
      res.status(500).json({ error: 'Failed to create content' });
    }
  });

  /**
   * @route   PUT /api/v1/content/:id
   * @desc    Update content
   * @access  Private
   */
  router.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contentId = parseInt(id);
      
      const { 
        title, 
        body, 
        excerpt, 
        status,
        featuredImage,
        metaTitle,
        metaDescription,
        tags
      } = req.body;
      
      // Get current content
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      // Check if user is authorized to edit
      const user = (req as any).user;
      const isAdmin = user.role === 'admin';
      const isAuthor = user.id === content.authorId;
      
      if (!isAdmin && !isAuthor) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      // Build update object
      const updateData: any = {};
      
      if (title !== undefined && title !== content.title) {
        updateData.title = title;
        
        // Only update slug if title changes
        let newSlug = slugify(title, { lower: true, strict: true });
        
        // Check if new slug exists and is different from current
        if (newSlug !== content.slug) {
          const existingContent = await storage.getContentBySlug(newSlug);
          if (existingContent && existingContent.id !== contentId) {
            // Add random suffix to slug
            newSlug = `${newSlug}-${Math.floor(Math.random() * 10000)}`;
          }
          updateData.slug = newSlug;
        }
      }
      
      if (body !== undefined) {
        updateData.body = body;
      }
      
      if (excerpt !== undefined) {
        updateData.excerpt = excerpt;
      }
      
      if (status !== undefined && status !== content.status) {
        updateData.status = status;
        
        // Set published date when publishing
        if (status === 'published' && content.status !== 'published') {
          updateData.publishedAt = new Date();
        }
      }
      
      if (featuredImage !== undefined) {
        updateData.featuredImage = featuredImage;
      }
      
      if (metaTitle !== undefined) {
        updateData.metaTitle = metaTitle;
      }
      
      if (metaDescription !== undefined) {
        updateData.metaDescription = metaDescription;
      }
      
      if (tags !== undefined) {
        updateData.tags = tags;
      }
      
      // Update content if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedContent = await storage.updateContent(contentId, updateData);
        
        if (!updatedContent) {
          return res.status(500).json({ error: 'Failed to update content' });
        }
        
        res.json({ content: updatedContent });
      } else {
        res.json({ content, message: 'No changes were made' });
      }
    } catch (error) {
      console.error('Update content error:', error);
      res.status(500).json({ error: 'Failed to update content' });
    }
  });

  /**
   * @route   DELETE /api/v1/content/:id
   * @desc    Delete content
   * @access  Private
   */
  router.delete('/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contentId = parseInt(id);
      
      // Get current content
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      // Check if user is authorized to delete
      const user = (req as any).user;
      const isAdmin = user.role === 'admin';
      const isAuthor = user.id === content.authorId;
      
      if (!isAdmin && !isAuthor) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      // Delete content
      const success = await storage.deleteContent(contentId);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to delete content' });
      }
      
      res.json({ message: 'Content deleted successfully' });
    } catch (error) {
      console.error('Delete content error:', error);
      res.status(500).json({ error: 'Failed to delete content' });
    }
  });

  // Register routes
  app.use(`${apiPrefix}/content`, router);
}