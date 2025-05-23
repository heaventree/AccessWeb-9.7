import { db } from '../lib/db.js';
import { pricingPlans } from '../shared/schema.js';
import { eq, asc } from 'drizzle-orm';

// Create new pricing plan - matches admin form payload exactly
export async function createAdminPricingPlan(req, res) {
  try {
    console.log('Creating pricing plan with payload:', req.body);
    
    const {
      name,
      description,
      price,
      currency = 'USD',
      period = 'month',
      features = [],
      isActive = true,
      isPopular = false,
      cta = 'Get Started',
      variant = 'outline',
      accentColor = 'text-primary'
    } = req.body;

    // Validate required fields - matching your payload structure
    if (!name || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, description'
      });
    }

    // Get the highest sort order and add 1
    const existingPlans = await db
      .select({ sortOrder: pricingPlans.sortOrder })
      .from(pricingPlans)
      .orderBy(asc(pricingPlans.sortOrder));
    
    const maxSortOrder = existingPlans.length > 0 ? Math.max(...existingPlans.map(p => p.sortOrder)) : 0;
    const sortOrder = maxSortOrder + 1;

    const now = new Date();
    const [newPlan] = await db
      .insert(pricingPlans)
      .values({
        name,
        description,
        price: parseFloat(price),
        currency,
        period,
        features,
        isActive,
        isPopular,
        cta,
        variant,
        accentColor,
        sortOrder,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    console.log('Successfully created plan:', newPlan);

    res.status(201).json({
      success: true,
      data: newPlan,
      message: 'Pricing plan created successfully'
    });
  } catch (error) {
    console.error('Error creating pricing plan:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create pricing plan',
      error: error.message
    });
  }
}

// Update pricing plan
export async function updateAdminPricingPlan(req, res) {
  try {
    const { id } = req.params;
    console.log('Updating pricing plan:', id, 'with payload:', req.body);
    
    const {
      name,
      description,
      price,
      currency,
      period,
      features,
      isActive,
      isPopular,
      cta,
      variant,
      accentColor
    } = req.body;

    const [updatedPlan] = await db
      .update(pricingPlans)
      .set({
        name,
        description,
        price: parseFloat(price),
        currency,
        period,
        features,
        isActive,
        isPopular,
        cta,
        variant,
        accentColor,
        updatedAt: new Date()
      })
      .where(eq(pricingPlans.id, parseInt(id)))
      .returning();

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      data: updatedPlan,
      message: 'Pricing plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing plan',
      error: error.message
    });
  }
}

// Delete pricing plan
export async function deleteAdminPricingPlan(req, res) {
  try {
    const { id } = req.params;
    console.log('Deleting pricing plan:', id);

    const [deletedPlan] = await db
      .delete(pricingPlans)
      .where(eq(pricingPlans.id, parseInt(id)))
      .returning();

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Pricing plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pricing plan',
      error: error.message
    });
  }
}