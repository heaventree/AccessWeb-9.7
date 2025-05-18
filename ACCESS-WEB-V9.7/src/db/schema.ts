import { pgTable, serial, text, varchar, timestamp, json, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
});

// Page table for Strapi CMS content
export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  layout: varchar('layout', { length: 50 }).default('default').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
  createdById: integer('created_by_id').references(() => users.id),
  draftStatus: boolean('draft_status').default(true),
});

// SEO metadata for pages
export const seoMetadata = pgTable('seo_metadata', {
  id: serial('id').primaryKey(),
  pageId: integer('page_id').references(() => pages.id).notNull(),
  metaTitle: varchar('meta_title', { length: 255 }).notNull(),
  metaDescription: text('meta_description'),
  keywords: text('keywords'),
  metaRobots: varchar('meta_robots', { length: 255 }),
  structuredData: json('structured_data'),
  metaViewport: varchar('meta_viewport', { length: 255 }),
  canonicalURL: varchar('canonical_url', { length: 255 }),
  metaImage: varchar('meta_image', { length: 255 }),
});

// Sections table for page content
export const sections = pgTable('sections', {
  id: serial('id').primaryKey(),
  pageId: integer('page_id').references(() => pages.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // e.g., 'hero', 'feature', 'content'
  content: json('content').notNull(), // Stores component-specific data
  order: integer('order').default(0),
});

// Navigation items
export const navigationItems = pgTable('navigation_items', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }),
  pageId: integer('page_id').references(() => pages.id),
  parentId: integer('parent_id').references(() => navigationItems.id),
  target: varchar('target', { length: 50 }).default('_self'),
  icon: varchar('icon', { length: 255 }),
  isButton: boolean('is_button').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Assets/Media table
export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 255 }),
  size: integer('size'),
  alternativeText: varchar('alternative_text', { length: 255 }),
  caption: text('caption'),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdById: integer('created_by_id').references(() => users.id),
});

// Define relations
export const pagesRelations = relations(pages, ({ one, many }) => ({
  creator: one(users, {
    fields: [pages.createdById],
    references: [users.id],
  }),
  sections: many(sections),
  seo: one(seoMetadata),
  navigationItems: many(navigationItems),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  page: one(pages, {
    fields: [sections.pageId],
    references: [pages.id],
  }),
}));

export const seoMetadataRelations = relations(seoMetadata, ({ one }) => ({
  page: one(pages, {
    fields: [seoMetadata.pageId],
    references: [pages.id],
  }),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  page: one(pages, {
    fields: [navigationItems.pageId],
    references: [pages.id],
  }),
  parent: one(navigationItems, {
    fields: [navigationItems.parentId],
    references: [navigationItems.id],
  }),
  children: many(navigationItems),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  creator: one(users, {
    fields: [assets.createdById],
    references: [users.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

export type Section = typeof sections.$inferSelect;
export type InsertSection = typeof sections.$inferInsert;

export type SEOMetadata = typeof seoMetadata.$inferSelect;
export type InsertSEOMetadata = typeof seoMetadata.$inferInsert;

export type NavigationItem = typeof navigationItems.$inferSelect;
export type InsertNavigationItem = typeof navigationItems.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;