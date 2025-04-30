import { eq, and } from 'drizzle-orm';
import { db } from './db';
import * as schema from '../shared/schema';
import type { 
  User, InsertUser, 
  Content, InsertContent,
  Category, InsertCategory,
  Subscription, InsertSubscription,
  Payment, InsertPayment,
  Invoice, InsertInvoice,
  Menu, InsertMenu,
  MenuItem, InsertMenuItem,
  Scan, InsertScan,
  ScanIssue, InsertScanIssue,
  Notification, InsertNotification,
  Setting, InsertSetting
} from '../shared/schema';

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContentBySlug(slug: string): Promise<Content | undefined>;
  getContentByType(type: string, limit?: number, offset?: number): Promise<Content[]>;
  getPublishedContent(type: string, limit?: number, offset?: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<Subscription | undefined>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getUserPayments(userId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getUserInvoices(userId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  
  // Menu operations
  getMenu(id: number): Promise<Menu | undefined>;
  getMenuByLocation(location: string): Promise<Menu | undefined>;
  getAllMenus(): Promise<Menu[]>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  updateMenu(id: number, menu: Partial<Menu>): Promise<Menu | undefined>;
  deleteMenu(id: number): Promise<boolean>;
  
  // MenuItem operations
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  getMenuItems(menuId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Scan operations
  getScan(id: number): Promise<Scan | undefined>;
  getUserScans(userId: number): Promise<Scan[]>;
  createScan(scan: InsertScan): Promise<Scan>;
  updateScan(id: number, scan: Partial<Scan>): Promise<Scan | undefined>;
  deleteScan(id: number): Promise<boolean>;
  
  // ScanIssue operations
  getScanIssue(id: number): Promise<ScanIssue | undefined>;
  getScanIssues(scanId: number): Promise<ScanIssue[]>;
  createScanIssue(scanIssue: InsertScanIssue): Promise<ScanIssue>;
  updateScanIssue(id: number, scanIssue: Partial<ScanIssue>): Promise<ScanIssue | undefined>;
  
  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getUserNotifications(userId: number, isRead?: boolean): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Setting operations
  getSetting(key: string): Promise<Setting | undefined>;
  getSettingsByGroup(group: string): Promise<Setting[]>;
  getPublicSettings(): Promise<Setting[]>;
  createOrUpdateSetting(key: string, value: string, group?: string, isPublic?: boolean): Promise<Setting>;
  deleteSetting(key: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(schema.users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }

  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined> {
    const [updatedUser] = await db.update(schema.users)
      .set({ 
        stripeCustomerId, 
        updatedAt: new Date() 
      })
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined> {
    const [updatedUser] = await db.update(schema.users)
      .set({ 
        stripeCustomerId: info.customerId, 
        stripeSubscriptionId: info.subscriptionId,
        updatedAt: new Date() 
      })
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(schema.users).where(eq(schema.users.id, id));
    return result.rowCount > 0;
  }

  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    const [content] = await db.select().from(schema.content).where(eq(schema.content.id, id));
    return content;
  }

  async getContentBySlug(slug: string): Promise<Content | undefined> {
    const [content] = await db.select().from(schema.content).where(eq(schema.content.slug, slug));
    return content;
  }

  async getContentByType(type: string, limit = 10, offset = 0): Promise<Content[]> {
    return db.select()
      .from(schema.content)
      .where(eq(schema.content.type, type))
      .limit(limit)
      .offset(offset)
      .orderBy(schema.content.createdAt);
  }

  async getPublishedContent(type: string, limit = 10, offset = 0): Promise<Content[]> {
    return db.select()
      .from(schema.content)
      .where(and(
        eq(schema.content.type, type),
        eq(schema.content.status, 'published')
      ))
      .limit(limit)
      .offset(offset)
      .orderBy(schema.content.publishedAt);
  }

  async createContent(content: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(schema.content).values(content).returning();
    return newContent;
  }

  async updateContent(id: number, content: Partial<Content>): Promise<Content | undefined> {
    const [updatedContent] = await db.update(schema.content)
      .set({ ...content, updatedAt: new Date() })
      .where(eq(schema.content.id, id))
      .returning();
    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    const result = await db.delete(schema.content).where(eq(schema.content.id, id));
    return result.rowCount > 0;
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug));
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return db.select().from(schema.categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(schema.categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined> {
    const [updatedCategory] = await db.update(schema.categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(schema.categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(schema.categories).where(eq(schema.categories.id, id));
    return result.rowCount > 0;
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id));
    return subscription;
  }

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return db.select()
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.userId, userId));
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(schema.subscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db.update(schema.subscriptions)
      .set({ ...subscription, updatedAt: new Date() })
      .where(eq(schema.subscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  async cancelSubscription(id: number): Promise<Subscription | undefined> {
    const [canceledSubscription] = await db.update(schema.subscriptions)
      .set({ 
        cancelAtPeriodEnd: true, 
        updatedAt: new Date() 
      })
      .where(eq(schema.subscriptions.id, id))
      .returning();
    return canceledSubscription;
  }

  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
    return payment;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return db.select()
      .from(schema.payments)
      .where(eq(schema.payments.userId, userId))
      .orderBy(schema.payments.createdAt);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(schema.payments).values(payment).returning();
    return newPayment;
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id));
    return invoice;
  }

  async getUserInvoices(userId: number): Promise<Invoice[]> {
    return db.select()
      .from(schema.invoices)
      .where(eq(schema.invoices.userId, userId))
      .orderBy(schema.invoices.createdAt);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(schema.invoices).values(invoice).returning();
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined> {
    const [updatedInvoice] = await db.update(schema.invoices)
      .set(invoice)
      .where(eq(schema.invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  // Menu operations
  async getMenu(id: number): Promise<Menu | undefined> {
    const [menu] = await db.select().from(schema.menus).where(eq(schema.menus.id, id));
    return menu;
  }

  async getMenuByLocation(location: string): Promise<Menu | undefined> {
    const [menu] = await db.select().from(schema.menus).where(eq(schema.menus.location, location));
    return menu;
  }

  async getAllMenus(): Promise<Menu[]> {
    return db.select().from(schema.menus);
  }

  async createMenu(menu: InsertMenu): Promise<Menu> {
    const [newMenu] = await db.insert(schema.menus).values(menu).returning();
    return newMenu;
  }

  async updateMenu(id: number, menu: Partial<Menu>): Promise<Menu | undefined> {
    const [updatedMenu] = await db.update(schema.menus)
      .set({ ...menu, updatedAt: new Date() })
      .where(eq(schema.menus.id, id))
      .returning();
    return updatedMenu;
  }

  async deleteMenu(id: number): Promise<boolean> {
    const result = await db.delete(schema.menus).where(eq(schema.menus.id, id));
    return result.rowCount > 0;
  }

  // MenuItem operations
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(schema.menuItems).where(eq(schema.menuItems.id, id));
    return menuItem;
  }

  async getMenuItems(menuId: number): Promise<MenuItem[]> {
    return db.select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.menuId, menuId))
      .orderBy(schema.menuItems.order);
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db.insert(schema.menuItems).values(menuItem).returning();
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db.update(schema.menuItems)
      .set({ ...menuItem, updatedAt: new Date() })
      .where(eq(schema.menuItems.id, id))
      .returning();
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));
    return result.rowCount > 0;
  }

  // Scan operations
  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(schema.scans).where(eq(schema.scans.id, id));
    return scan;
  }

  async getUserScans(userId: number): Promise<Scan[]> {
    return db.select()
      .from(schema.scans)
      .where(eq(schema.scans.userId, userId))
      .orderBy(schema.scans.createdAt);
  }

  async createScan(scan: InsertScan): Promise<Scan> {
    const [newScan] = await db.insert(schema.scans).values(scan).returning();
    return newScan;
  }

  async updateScan(id: number, scan: Partial<Scan>): Promise<Scan | undefined> {
    const [updatedScan] = await db.update(schema.scans)
      .set({ ...scan, updatedAt: new Date() })
      .where(eq(schema.scans.id, id))
      .returning();
    return updatedScan;
  }

  async deleteScan(id: number): Promise<boolean> {
    const result = await db.delete(schema.scans).where(eq(schema.scans.id, id));
    return result.rowCount > 0;
  }

  // ScanIssue operations
  async getScanIssue(id: number): Promise<ScanIssue | undefined> {
    const [scanIssue] = await db.select().from(schema.scanIssues).where(eq(schema.scanIssues.id, id));
    return scanIssue;
  }

  async getScanIssues(scanId: number): Promise<ScanIssue[]> {
    return db.select()
      .from(schema.scanIssues)
      .where(eq(schema.scanIssues.scanId, scanId));
  }

  async createScanIssue(scanIssue: InsertScanIssue): Promise<ScanIssue> {
    const [newScanIssue] = await db.insert(schema.scanIssues).values(scanIssue).returning();
    return newScanIssue;
  }

  async updateScanIssue(id: number, scanIssue: Partial<ScanIssue>): Promise<ScanIssue | undefined> {
    const [updatedScanIssue] = await db.update(schema.scanIssues)
      .set(scanIssue)
      .where(eq(schema.scanIssues.id, id))
      .returning();
    return updatedScanIssue;
  }

  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(schema.notifications).where(eq(schema.notifications.id, id));
    return notification;
  }

  async getUserNotifications(userId: number, isRead?: boolean): Promise<Notification[]> {
    let query = db.select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, userId));
    
    if (isRead !== undefined) {
      query = query.where(eq(schema.notifications.isRead, isRead));
    }
    
    return query.orderBy(schema.notifications.createdAt);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(schema.notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db.update(schema.notifications)
      .set({ isRead: true })
      .where(eq(schema.notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db.delete(schema.notifications).where(eq(schema.notifications.id, id));
    return result.rowCount > 0;
  }

  // Setting operations
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(schema.settings).where(eq(schema.settings.key, key));
    return setting;
  }

  async getSettingsByGroup(group: string): Promise<Setting[]> {
    return db.select()
      .from(schema.settings)
      .where(eq(schema.settings.group, group));
  }

  async getPublicSettings(): Promise<Setting[]> {
    return db.select()
      .from(schema.settings)
      .where(eq(schema.settings.isPublic, true));
  }

  async createOrUpdateSetting(key: string, value: string, group?: string, isPublic = false): Promise<Setting> {
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      const [updatedSetting] = await db.update(schema.settings)
        .set({ 
          value, 
          group: group || existingSetting.group, 
          isPublic: isPublic !== undefined ? isPublic : existingSetting.isPublic,
          updatedAt: new Date() 
        })
        .where(eq(schema.settings.key, key))
        .returning();
      return updatedSetting;
    } else {
      const [newSetting] = await db.insert(schema.settings)
        .values({ 
          key, 
          value, 
          group, 
          isPublic 
        })
        .returning();
      return newSetting;
    }
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await db.delete(schema.settings).where(eq(schema.settings.key, key));
    return result.rowCount > 0;
  }
}

// Export a singleton instance of DatabaseStorage
export const storage = new DatabaseStorage();