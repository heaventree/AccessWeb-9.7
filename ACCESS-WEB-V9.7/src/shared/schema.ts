import { pgTable, serial, timestamp, varchar, text, integer, boolean, jsonb, index, foreignKey, primaryKey, numeric, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  username: varchar('username', { length: 50 }).notNull(),
  fullName: varchar('full_name', { length: 100 }),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false),
  verificationToken: varchar('verification_token', { length: 255 }),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordExpires: timestamp('reset_password_expires'),
  isTwoFactorEnabled: boolean('is_two_factor_enabled').notNull().default(false),
  twoFactorCode: varchar('two_factor_code', { length: 10 }),
  twoFactorCodeExpiry: timestamp('two_factor_code_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 })
}, (table) => {
  return {
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username)
  };
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  scans: many(scans),
  content: many(content),
  siteConnections: many(siteConnections),
  apiKeys: many(apiKeys)
}));

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripePlanId: varchar('stripe_plan_id', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('inactive'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  planType: varchar('plan_type', { length: 50 }).notNull(),
  features: jsonb('features'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('subscription_user_id_idx').on(table.userId)
  };
});

// Subscription relations
export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  }),
  pricingPlan: one(pricingPlans, {
    fields: [subscriptions.planType],
    references: [pricingPlans.slug]
  }),
  invoices: many(invoices)
}));

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: integer('subscription_id').references(() => subscriptions.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 20 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  invoiceUrl: varchar('invoice_url', { length: 255 }),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('payment_user_id_idx').on(table.userId),
    subscriptionIdIdx: index('payment_subscription_id_idx').on(table.subscriptionId)
  };
});

// Payment relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id]
  }),
  invoice: one(invoices, {
    fields: [payments.id],
    references: [invoices.paymentId]
  })
}));

// Invoices table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: integer('subscription_id').references(() => subscriptions.id),
  paymentId: integer('payment_id'),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 20 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidDate: timestamp('paid_date'),
  invoiceUrl: varchar('invoice_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('invoice_user_id_idx').on(table.userId),
    subscriptionIdIdx: index('invoice_subscription_id_idx').on(table.subscriptionId)
  };
});

// Invoice relations
export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id]
  }),
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id]
  }),
  payment: one(payments, {
    fields: [invoices.paymentId],
    references: [payments.id]
  })
}));

// Content table (for blog, help articles, pages)
export const content = pgTable('content', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  body: text('body').notNull(),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 255 }),
  authorId: integer('author_id').references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  type: varchar('type', { length: 20 }).notNull(), // 'post', 'page', 'help'
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  tags: jsonb('tags').$type<string[]>(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    slugIdx: index('content_slug_idx').on(table.slug),
    typeIdx: index('content_type_idx').on(table.type),
    authorIdIdx: index('content_author_id_idx').on(table.authorId)
  };
});

// Content relations
export const contentRelations = relations(content, ({ one, many }) => ({
  author: one(users, {
    fields: [content.authorId],
    references: [users.id]
  }),
  categories: many(contentCategories)
}));

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  parentId: integer('parent_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Category relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id]
  }),
  content: many(contentCategories)
}));

// Content-Categories join table
export const contentCategories = pgTable('content_categories', {
  contentId: integer('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' })
}, (table) => {
  return {
    pk: primaryKey(table.contentId, table.categoryId)
  };
});

// Content-Categories relations
export const contentCategoriesRelations = relations(contentCategories, ({ one }) => ({
  content: one(content, {
    fields: [contentCategories.contentId],
    references: [content.id]
  }),
  category: one(categories, {
    fields: [contentCategories.categoryId],
    references: [categories.id]
  })
}));

// Menu items table
export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  location: varchar('location', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Menu items table
export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull().references(() => menus.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 100 }).notNull(),
  url: varchar('url', { length: 255 }),
  target: varchar('target', { length: 20 }).default('_self'),
  contentId: integer('content_id').references(() => content.id),
  parentId: integer('parent_id').references(() => menuItems.id),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    menuIdIdx: index('menu_item_menu_id_idx').on(table.menuId),
    parentIdIdx: index('menu_item_parent_id_idx').on(table.parentId)
  };
});

// Menu relations
export const menusRelations = relations(menus, ({ many }) => ({
  items: many(menuItems)
}));

// MenuItem relations
export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  menu: one(menus, {
    fields: [menuItems.menuId],
    references: [menus.id]
  }),
  parent: one(menuItems, {
    fields: [menuItems.parentId],
    references: [menuItems.id]
  }),
  children: many(menuItems, { relationName: 'parent_child' }),
  content: one(content, {
    fields: [menuItems.contentId],
    references: [content.id]
  })
}));

// Scans table for accessibility scans
export const scans = pgTable('scans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  summary: jsonb('summary'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('scan_user_id_idx').on(table.userId),
    urlIdx: index('scan_url_idx').on(table.url)
  };
});

// Scan relations
export const scansRelations = relations(scans, ({ one, many }) => ({
  user: one(users, {
    fields: [scans.userId],
    references: [users.id]
  }),
  issues: many(scanIssues)
}));

// Site connections table for WordPress and other integrations
export const siteConnections = pgTable('site_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  siteName: varchar('site_name', { length: 100 }).notNull(),
  siteUrl: varchar('site_url', { length: 255 }).notNull(),
  platform: varchar('platform', { length: 50 }).notNull().default('wordpress'), // wordpress, custom, shopify, etc.
  apiToken: varchar('api_token', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('inactive'), // active, inactive, error
  isActive: boolean('is_active').notNull().default(false),
  lastScanAt: timestamp('last_scan_at'),
  scanFrequency: varchar('scan_frequency', { length: 20 }).default('weekly'), // daily, weekly, monthly
  autoScanEnabled: boolean('auto_scan_enabled').notNull().default(false),
  webhookUrl: varchar('webhook_url', { length: 255 }),
  config: jsonb('config'), // Platform-specific configuration
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('site_connection_user_id_idx').on(table.userId),
    apiTokenIdx: index('site_connection_api_token_idx').on(table.apiToken),
    statusIdx: index('site_connection_status_idx').on(table.status)
  };
});

// Site connection relations
export const siteConnectionsRelations = relations(siteConnections, ({ one, many }) => ({
  user: one(users, {
    fields: [siteConnections.userId],
    references: [users.id]
  }),
  scans: many(scans)
}));

// Scan issues table
export const scanIssues = pgTable('scan_issues', {
  id: serial('id').primaryKey(),
  scanId: integer('scan_id').notNull().references(() => scans.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  impact: varchar('impact', { length: 20 }).notNull(),
  description: text('description').notNull(),
  help: text('help'),
  helpUrl: varchar('help_url', { length: 255 }),
  htmlCode: text('html_code'),
  selector: varchar('selector', { length: 255 }),
  wcagCriteria: jsonb('wcag_criteria').$type<string[]>(),
  resolution: text('resolution'),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    scanIdIdx: index('scan_issue_scan_id_idx').on(table.scanId),
    typeIdx: index('scan_issue_type_idx').on(table.type),
    impactIdx: index('scan_issue_impact_idx').on(table.impact)
  };
});

// Scan issue relations
export const scanIssuesRelations = relations(scanIssues, ({ one }) => ({
  scan: one(scans, {
    fields: [scanIssues.scanId],
    references: [scans.id]
  })
}));

// Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  action: varchar('action', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('notification_user_id_idx').on(table.userId)
  };
});

// Notification relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

// Settings table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  group: varchar('group', { length: 50 }),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    keyIdx: index('setting_key_idx').on(table.key),
    groupIdx: index('setting_group_idx').on(table.group)
  };
});

// Pricing Plans table
export const pricingPlans = pgTable('pricing_plans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  billingPeriod: varchar('billing_period', { length: 20 }).notNull(), // 'monthly', 'yearly'
  stripeProductId: varchar('stripe_product_id', { length: 255 }),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  scanLimits: jsonb('scan_limits').$type<{
    monthly: number;
    concurrent: number;
    pageDepth: number;
  }>(),
  isActive: boolean('is_active').notNull().default(true),
  isPopular: boolean('is_popular').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    slugIdx: index('pricing_plan_slug_idx').on(table.slug),
    activeIdx: index('pricing_plan_active_idx').on(table.isActive),
    sortOrderIdx: index('pricing_plan_sort_order_idx').on(table.sortOrder)
  };
});

// Pricing Plans relations
export const pricingPlansRelations = relations(pricingPlans, ({ many }) => ({
  subscriptions: many(subscriptions)
}));

// API Keys table
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  keyId: varchar('key_id', { length: 50 }).notNull().unique(), // Public identifier (visible to user)
  keyHash: varchar('key_hash', { length: 255 }).notNull(), // Hashed API key for security
  lastUsed: timestamp('last_used'),
  isActive: boolean('is_active').notNull().default(true),
  usageCount: integer('usage_count').notNull().default(0),
  rateLimit: integer('rate_limit').default(1000), // requests per hour
  allowedOrigins: jsonb('allowed_origins').$type<string[]>().default([]), // CORS origins
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('api_key_user_id_idx').on(table.userId),
    keyIdIdx: index('api_key_key_id_idx').on(table.keyId),
    activeIdx: index('api_key_active_idx').on(table.isActive)
  };
});

// API Keys relations
export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id]
  })
}));

// API Usage tracking table
export const apiUsage = pgTable('api_usage', {
  id: serial('id').primaryKey(),
  apiKeyId: integer('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),
  endpoint: varchar('endpoint', { length: 100 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  requestUrl: varchar('request_url', { length: 500 }),
  statusCode: integer('status_code'),
  responseTime: integer('response_time'), // in milliseconds
  userAgent: varchar('user_agent', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  requestData: jsonb('request_data'),
  responseData: jsonb('response_data'),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    apiKeyIdIdx: index('api_usage_api_key_id_idx').on(table.apiKeyId),
    createdAtIdx: index('api_usage_created_at_idx').on(table.createdAt),
    endpointIdx: index('api_usage_endpoint_idx').on(table.endpoint)
  };
});

// API Usage relations
export const apiUsageRelations = relations(apiUsage, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [apiUsage.apiKeyId],
    references: [apiKeys.id]
  })
}));

// Export types for use in application code
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Menu = typeof menus.$inferSelect;
export type InsertMenu = typeof menus.$inferInsert;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

export type Scan = typeof scans.$inferSelect;
export type InsertScan = typeof scans.$inferInsert;

export type ScanIssue = typeof scanIssues.$inferSelect;
export type InsertScanIssue = typeof scanIssues.$inferInsert;

export type SiteConnection = typeof siteConnections.$inferSelect;
export type InsertSiteConnection = typeof siteConnections.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertPricingPlan = typeof pricingPlans.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = typeof apiUsage.$inferInsert;