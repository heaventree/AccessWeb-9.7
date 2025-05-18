import { db } from '../db';
import { 
  pages, 
  sections, 
  seoMetadata, 
  navigationItems,
  assets,
  type Page,
  type InsertPage,
  type Section,
  type InsertSection,
  type SEOMetadata,
  type InsertSEOMetadata,
  type NavigationItem,
  type InsertNavigationItem,
  type Asset,
  type InsertAsset
} from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

/**
 * Database service for Strapi CMS content operations
 */
class DatabaseService {
  // Pages
  async getPageById(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async getAllPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(asc(pages.title));
  }

  async getPublishedPages(): Promise<Page[]> {
    return await db.select()
      .from(pages)
      .where(and(
        eq(pages.draftStatus, false),
        // Ensure publishedAt is not null
        pages.publishedAt.isNotNull()
      ))
      .orderBy(desc(pages.publishedAt));
  }

  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
  }

  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  async deletePage(id: number): Promise<boolean> {
    const [deletedPage] = await db
      .delete(pages)
      .where(eq(pages.id, id))
      .returning();
    return !!deletedPage;
  }

  // Sections
  async getSectionsByPageId(pageId: number): Promise<Section[]> {
    return await db
      .select()
      .from(sections)
      .where(eq(sections.pageId, pageId))
      .orderBy(asc(sections.order));
  }

  async createSection(section: InsertSection): Promise<Section> {
    const [newSection] = await db.insert(sections).values(section).returning();
    return newSection;
  }

  async updateSection(id: number, section: Partial<InsertSection>): Promise<Section | undefined> {
    const [updatedSection] = await db
      .update(sections)
      .set(section)
      .where(eq(sections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteSection(id: number): Promise<boolean> {
    const [deletedSection] = await db
      .delete(sections)
      .where(eq(sections.id, id))
      .returning();
    return !!deletedSection;
  }

  // SEO Metadata
  async getSEOMetadataByPageId(pageId: number): Promise<SEOMetadata | undefined> {
    const [metadata] = await db
      .select()
      .from(seoMetadata)
      .where(eq(seoMetadata.pageId, pageId));
    return metadata;
  }

  async createSEOMetadata(metadata: InsertSEOMetadata): Promise<SEOMetadata> {
    const [newMetadata] = await db.insert(seoMetadata).values(metadata).returning();
    return newMetadata;
  }

  async updateSEOMetadata(id: number, metadata: Partial<InsertSEOMetadata>): Promise<SEOMetadata | undefined> {
    const [updatedMetadata] = await db
      .update(seoMetadata)
      .set(metadata)
      .where(eq(seoMetadata.id, id))
      .returning();
    return updatedMetadata;
  }

  // Navigation
  async getNavigationItems(): Promise<NavigationItem[]> {
    return await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.parentId, null))
      .orderBy(asc(navigationItems.order));
  }

  async getChildNavigationItems(parentId: number): Promise<NavigationItem[]> {
    return await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.parentId, parentId))
      .orderBy(asc(navigationItems.order));
  }

  async createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem> {
    const [newItem] = await db.insert(navigationItems).values(item).returning();
    return newItem;
  }

  async updateNavigationItem(id: number, item: Partial<InsertNavigationItem>): Promise<NavigationItem | undefined> {
    const [updatedItem] = await db
      .update(navigationItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(navigationItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteNavigationItem(id: number): Promise<boolean> {
    const [deletedItem] = await db
      .delete(navigationItems)
      .where(eq(navigationItems.id, id))
      .returning();
    return !!deletedItem;
  }

  // Assets
  async getAssetById(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async getAllAssets(): Promise<Asset[]> {
    return await db.select().from(assets).orderBy(desc(assets.createdAt));
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    return newAsset;
  }

  async updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset | undefined> {
    const [updatedAsset] = await db
      .update(assets)
      .set({ ...asset, updatedAt: new Date() })
      .where(eq(assets.id, id))
      .returning();
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const [deletedAsset] = await db
      .delete(assets)
      .where(eq(assets.id, id))
      .returning();
    return !!deletedAsset;
  }

  // Complex queries
  async getPageWithRelations(slug: string): Promise<any> {
    // Get the page
    const page = await this.getPageBySlug(slug);
    if (!page) return null;

    // Get sections
    const pageSections = await this.getSectionsByPageId(page.id);
    
    // Get SEO metadata
    const seo = await this.getSEOMetadataByPageId(page.id);

    // Return comprehensive page data
    return {
      ...page,
      sections: pageSections,
      seo: seo || null
    };
  }

  async getNavigationWithStructure(): Promise<any[]> {
    const topLevelItems = await this.getNavigationItems();
    
    // For each top-level item, fetch children
    const result = await Promise.all(
      topLevelItems.map(async (item) => {
        const children = await this.getChildNavigationItems(item.id);
        return {
          ...item,
          children: children.length ? children : undefined
        };
      })
    );

    return result;
  }
}

export const databaseService = new DatabaseService();
export default databaseService;