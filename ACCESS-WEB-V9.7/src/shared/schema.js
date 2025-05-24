import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Pricing plans table - updated for Stripe integration with numeric pricing
export const pricingPlans = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Numeric price for Stripe
  currency: varchar("currency", { length: 3 }).default("USD").notNull(), // Separate currency field
  period: varchar("period", { length: 20 }).default("month").notNull(),
  features: jsonb("features").notNull(), // Array of {text: string, available: boolean}
  isPopular: boolean("is_popular").default(false),
  cta: varchar("cta", { length: 50 }).default("Get Started").notNull(),
  variant: varchar("variant", { length: 20 }).default("outline").notNull(), // "outline", "primary"
  accentColor: varchar("accent_color", { length: 50 }).default("text-primary").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table (from existing schema)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu items table (from existing schema)
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  url: varchar("url", { length: 255 }),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  // Add user relations here if needed
}));

export const pricingPlansRelations = relations(pricingPlans, ({ many }) => ({
  // Add pricing plan relations here if needed
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  parent: one(menuItems, {
    fields: [menuItems.parentId],
    references: [menuItems.id],
  }),
  children: many(menuItems),
}));