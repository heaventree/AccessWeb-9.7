import fs from 'fs';
import path from 'path';
import { db } from '../src/db';
import { pages, sections, seoMetadata, users } from '../src/db/schema';
import React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * This script migrates existing React components and pages
 * into the Strapi CMS database structure
 */
async function migrateExistingContent() {
  console.log('Migrating existing content to Strapi CMS...');
  
  try {
    // First, ensure we have an admin user
    console.log('Checking for admin user...');
    const [adminUser] = await db.select().from(users).where('username', '=', 'admin');
    
    let adminUserId;
    
    if (!adminUser) {
      console.log('Creating admin user...');
      const [newAdmin] = await db.insert(users).values({
        username: 'admin',
        email: 'admin@example.com',
        password: '$2b$10$GJIvxfXJ0oRhJJLZIyD.XeiIr0bU3N4nEEJVe2jXF7RoN2eyjKcIi', // hashed 'admin123'
        fullName: 'Admin User'
      }).returning();
      
      adminUserId = newAdmin.id;
    } else {
      adminUserId = adminUser.id;
    }
    
    console.log(`Admin user ID: ${adminUserId}`);
    
    // Define the pages to migrate - these would be your existing pages
    const pagesToMigrate = [
      {
        componentPath: '../src/pages/tools/WCAGColorPalettePage.tsx',
        pageInfo: {
          title: 'WCAG Colour Palette',
          slug: 'tools/colour-palette',
          layout: 'default',
        },
        seo: {
          metaTitle: 'WCAG Colour Palette | AccessWeb',
          metaDescription: 'Ensure your color combinations meet WCAG 2.1 contrast requirements for text readability.'
        }
      },
      {
        componentPath: '../src/pages/tools/ImageAltScannerPage.tsx',
        pageInfo: {
          title: 'Image Alt Scanner',
          slug: 'tools/image-alt-scanner',
          layout: 'default',
        },
        seo: {
          metaTitle: 'Image Alt Scanner | AccessWeb',
          metaDescription: 'Identify images missing alternative text and get AI-powered suggestions for better accessibility.'
        }
      }
    ];
    
    // Process each page
    for (const pageData of pagesToMigrate) {
      console.log(`Migrating page: ${pageData.pageInfo.title}`);
      
      // Check if page already exists
      const existingPage = await db.select().from(pages).where('slug', '=', pageData.pageInfo.slug).execute();
      
      if (existingPage.length > 0) {
        console.log(`Page ${pageData.pageInfo.title} already exists, skipping...`);
        continue;
      }
      
      // Create the page
      const [newPage] = await db.insert(pages).values({
        ...pageData.pageInfo,
        publishedAt: new Date(),
        draftStatus: false,
        createdById: adminUserId
      }).returning();
      
      console.log(`Created page with ID: ${newPage.id}`);
      
      // Add SEO metadata
      await db.insert(seoMetadata).values({
        pageId: newPage.id,
        metaTitle: pageData.seo.metaTitle,
        metaDescription: pageData.seo.metaDescription
      });
      
      console.log(`Added SEO metadata for page: ${newPage.id}`);
      
      // For this example, we're adding a placeholder content section
      // In a real migration, you would parse the React component and extract content
      await db.insert(sections).values({
        pageId: newPage.id,
        type: 'blocks.content-block',
        order: 0,
        content: JSON.stringify({
          title: pageData.pageInfo.title,
          content: `<p>This content was migrated from the existing ${pageData.pageInfo.title} page.</p>
<p>In a real implementation, this would contain the actual content extracted from the React component.</p>`,
          alignment: 'left'
        })
      });
      
      console.log(`Added content section for page: ${newPage.id}`);
    }
    
    console.log('Content migration completed successfully!');
  } catch (error) {
    console.error('Error migrating content:', error);
    process.exit(1);
  }
}

// Run the migration
migrateExistingContent()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });