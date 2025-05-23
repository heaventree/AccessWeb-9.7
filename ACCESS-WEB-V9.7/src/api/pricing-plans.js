import { db } from '../lib/db.js';
import { pricingPlans } from '../shared/schema.js';
import { eq, asc } from 'drizzle-orm';

// Get all pricing plans (public endpoint) - for frontend pricing section
export async function getAllPricingPlans(req, res) {
  try {
    const plans = await db
      .select({
        id: pricingPlans.id,
        name: pricingPlans.name,
        description: pricingPlans.description,
        price: pricingPlans.price,
        period: pricingPlans.period,
        features: pricingPlans.features,
        isPopular: pricingPlans.isPopular,
        cta: pricingPlans.cta,
        variant: pricingPlans.variant,
        accentColor: pricingPlans.accentColor
      })
      .from(pricingPlans)
      .where(eq(pricingPlans.isActive, true))
      .orderBy(asc(pricingPlans.sortOrder));

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing plans'
    });
  }
}

// Get all pricing plans for admin (including inactive)
export async function getAdminPricingPlans(req, res) {
  try {
    const plans = await db
      .select()
      .from(pricingPlans)
      .orderBy(asc(pricingPlans.sortOrder));

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching admin pricing plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing plans'
    });
  }
}

// Get single pricing plan
export async function getPricingPlan(req, res) {
  try {
    const { id } = req.params;
    
    const [plan] = await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.id, parseInt(id)));

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing plan'
    });
  }
}

// Create new pricing plan (admin only)
export async function createPricingPlan(req, res) {
  try {
    const {
      name,
      slug,
      description,
      price,
      currency = 'USD',
      billingPeriod,
      stripeProductId,
      stripePriceId,
      features = [],
      scanLimits,
      isActive = true,
      isPopular = false,
      sortOrder = 0
    } = req.body;

    // Validate required fields
    if (!name || !slug || !price || !billingPeriod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, slug, price, billingPeriod'
      });
    }

    const [newPlan] = await db
      .insert(pricingPlans)
      .values({
        name,
        slug,
        description,
        price: price.toString(),
        currency,
        billingPeriod,
        stripeProductId,
        stripePriceId,
        features,
        scanLimits,
        isActive,
        isPopular,
        sortOrder
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newPlan,
      message: 'Pricing plan created successfully'
    });
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'A pricing plan with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create pricing plan'
    });
  }
}

// Update pricing plan (admin only)
export async function updatePricingPlan(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      currency,
      billingPeriod,
      stripeProductId,
      stripePriceId,
      features,
      scanLimits,
      isActive,
      isPopular,
      sortOrder
    } = req.body;

    const [updatedPlan] = await db
      .update(pricingPlans)
      .set({
        name,
        slug,
        description,
        price: price ? price.toString() : undefined,
        currency,
        billingPeriod,
        stripeProductId,
        stripePriceId,
        features,
        scanLimits,
        isActive,
        isPopular,
        sortOrder,
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

    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'A pricing plan with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update pricing plan'
    });
  }
}

// Delete pricing plan (admin only)
export async function deletePricingPlan(req, res) {
  try {
    const { id } = req.params;

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
      message: 'Failed to delete pricing plan'
    });
  }
}