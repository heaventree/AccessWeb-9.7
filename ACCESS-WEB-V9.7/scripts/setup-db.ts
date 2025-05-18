import { db } from '../src/db';
import { eq } from 'drizzle-orm';
import { 
  pages, 
  sections, 
  seoMetadata, 
  navigationItems, 
  users
} from '../src/db/schema';

/**
 * This script sets up the database tables and creates initial sample content
 * for the Strapi CMS integration
 */
async function setupDatabase() {
  console.log('Setting up database for Strapi CMS integration...');
  
  try {
    // Create admin user for content creation
    console.log('Creating admin user...');
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).execute();
    
    let adminUserId;
    
    if (existingAdmin.length === 0) {
      const [adminUser] = await db.insert(users).values({
        username: 'admin',
        email: 'admin@example.com',
        password: '$2b$10$GJIvxfXJ0oRhJJLZIyD.XeiIr0bU3N4nEEJVe2jXF7RoN2eyjKcIi', // hashed 'admin123'
        fullName: 'Admin User'
      }).returning();
      
      adminUserId = adminUser.id;
      console.log('Admin user created with ID:', adminUserId);
    } else {
      adminUserId = existingAdmin[0].id;
      console.log('Admin user already exists with ID:', adminUserId);
    }
    
    // Create sample pages
    console.log('Creating sample pages...');
    
    // 1. Home page
    const existingHomePage = await db.select().from(pages).where(eq(pages.slug, 'home')).execute();
    
    let homePageId;
    
    if (existingHomePage.length === 0) {
      const [homePage] = await db.insert(pages).values({
        title: 'Home',
        slug: 'home',
        layout: 'full-width',
        publishedAt: new Date(),
        draftStatus: false,
        createdById: adminUserId
      }).returning();
      
      homePageId = homePage.id;
      console.log('Home page created with ID:', homePageId);
      
      // Add SEO metadata for home page
      await db.insert(seoMetadata).values({
        pageId: homePageId,
        metaTitle: 'AccessWeb | Web Accessibility Platform',
        metaDescription: 'Create inclusive digital experiences through intelligent accessibility compliance tools'
      });
      
      // Add hero section to home page
      await db.insert(sections).values({
        pageId: homePageId,
        type: 'sections.hero-section',
        order: 0,
        content: JSON.stringify({
          title: 'Create Inclusive Digital Experiences',
          subtitle: 'Our intelligent accessibility compliance tools help you build web applications that everyone can use.',
          alignment: 'center',
          height: 'large',
          buttonText: 'Get Started',
          buttonLink: '/my-account'
        })
      });
      
      // Add features section to home page
      await db.insert(sections).values({
        pageId: homePageId,
        type: 'sections.feature-section',
        order: 1,
        content: JSON.stringify({
          title: 'Our Accessibility Tools',
          description: 'Powerful tools to help you create more accessible websites',
          columns: '3',
          features: [
            {
              id: 1,
              title: 'WCAG Colour Palette',
              description: 'Ensure your color combinations meet WCAG 2.1 contrast requirements for text readability.',
              icon: '🎨',
              linkText: 'Try Tool',
              linkUrl: '/tools/colour-palette'
            },
            {
              id: 2,
              title: 'Image Alt Scanner',
              description: 'Identify images missing alternative text and get AI-powered suggestions for better accessibility.',
              icon: '🖼️',
              linkText: 'Try Tool',
              linkUrl: '/tools/image-alt-scanner'
            },
            {
              id: 3,
              title: 'Accessibility Reports',
              description: 'Generate comprehensive reports on your website\'s accessibility compliance with detailed recommendations.',
              icon: '📊',
              linkText: 'Sign Up',
              linkUrl: '/my-account'
            }
          ]
        })
      });
    } else {
      homePageId = existingHomePage[0].id;
      console.log('Home page already exists with ID:', homePageId);
    }
    
    // 2. About page
    const existingAboutPage = await db.select().from(pages).where(eq(pages.slug, 'about')).execute();
    
    let aboutPageId;
    
    if (existingAboutPage.length === 0) {
      const [aboutPage] = await db.insert(pages).values({
        title: 'About Us',
        slug: 'about',
        layout: 'default',
        publishedAt: new Date(),
        draftStatus: false,
        createdById: adminUserId
      }).returning();
      
      aboutPageId = aboutPage.id;
      console.log('About page created with ID:', aboutPageId);
      
      // Add SEO metadata for about page
      await db.insert(seoMetadata).values({
        pageId: aboutPageId,
        metaTitle: 'About Us | AccessWeb',
        metaDescription: 'Learn about our mission to make the web accessible for everyone'
      });
      
      // Add hero section to about page
      await db.insert(sections).values({
        pageId: aboutPageId,
        type: 'sections.hero-section',
        order: 0,
        content: JSON.stringify({
          title: 'Our Mission',
          subtitle: 'Making the web accessible for everyone',
          alignment: 'center',
          height: 'small'
        })
      });
      
      // Add content block to about page
      await db.insert(sections).values({
        pageId: aboutPageId,
        type: 'blocks.content-block',
        order: 1,
        content: JSON.stringify({
          title: 'About AccessWeb',
          content: `<p>AccessWeb is a cutting-edge platform dedicated to making the web accessible to everyone, regardless of ability or disability. Our suite of tools helps developers, designers, and content creators ensure their digital products are inclusive and comply with accessibility standards.</p><h2>Our Story</h2><p>Founded in 2022, AccessWeb began with a simple mission: to create a more inclusive digital world. We recognized that many websites and applications were unintentionally excluding users with disabilities, and we set out to change that.</p><p>Our team of accessibility experts and software engineers have developed innovative tools that make it easier than ever to identify and fix accessibility issues.</p><h2>Our Values</h2><ul><li><strong>Inclusion:</strong> We believe the web should be accessible to everyone.</li><li><strong>Innovation:</strong> We're constantly developing new ways to simplify accessibility.</li><li><strong>Education:</strong> We're committed to teaching best practices for digital accessibility.</li></ul>`,
          alignment: 'left'
        })
      });
    } else {
      aboutPageId = existingAboutPage[0].id;
      console.log('About page already exists with ID:', aboutPageId);
    }
    
    // Create navigation items
    console.log('Creating navigation structure...');
    
    const existingHomeNav = await db.select().from(navigationItems).where(eq(navigationItems.label, 'Home')).execute();
    
    if (existingHomeNav.length === 0) {
      // Home
      await db.insert(navigationItems).values({
        label: 'Home',
        pageId: homePageId,
        order: 0
      });
      
      // About
      await db.insert(navigationItems).values({
        label: 'About',
        pageId: aboutPageId,
        order: 1
      });
      
      // Tools dropdown
      const [toolsNav] = await db.insert(navigationItems).values({
        label: 'Tools',
        url: '#',
        order: 2
      }).returning();
      
      // Tools dropdown children
      await db.insert(navigationItems).values([
        {
          label: 'WCAG Colour Palette',
          url: '/tools/colour-palette',
          parentId: toolsNav.id,
          order: 0
        },
        {
          label: 'Image Alt Scanner',
          url: '/tools/image-alt-scanner',
          parentId: toolsNav.id,
          order: 1
        }
      ]);
      
      // My Account button
      await db.insert(navigationItems).values({
        label: 'My Account',
        url: '/my-account',
        isButton: true,
        order: 3
      });
      
      console.log('Navigation items created successfully');
    } else {
      console.log('Navigation items already exist');
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });