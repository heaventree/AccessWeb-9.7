import { db } from '../src/lib/db.js';
import { pricingPlans } from '../src/shared/schema.js';

// The exact three pricing plans as specified
const plansToInsert = [
  {
    name: "Starter",
    description: "Perfect for small websites and blogs",
    price: "$29",
    period: "month",
    features: [
      { text: "Up to 100 pages scanned", available: true },
      { text: "Weekly automated scans", available: true },
      { text: "Basic compliance reporting", available: true },
      { text: "Email support", available: true },
      { text: "Automated fixes", available: false },
      { text: "PDF export", available: false }
    ],
    cta: "Get Started",
    variant: "outline",
    accentColor: "text-primary",
    sortOrder: 1,
    isActive: true,
    isPopular: false
  },
  {
    name: "Professional",
    description: "For growing businesses and e-commerce",
    price: "$49",
    period: "month",
    features: [
      { text: "Up to 500 pages scanned", available: true },
      { text: "Daily automated scans", available: true },
      { text: "Advanced compliance reporting", available: true },
      { text: "Automated fixes with suggestions", available: true },
      { text: "Priority email and chat support", available: true },
      { text: "PDF & CSV exports", available: true }
    ],
    isPopular: true,
    cta: "Get Started",
    variant: "primary",
    accentColor: "text-[#0fae96]",
    sortOrder: 2,
    isActive: true
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: "$99",
    period: "month",
    features: [
      { text: "Unlimited pages scanned", available: true },
      { text: "Real-time compliance monitoring", available: true },
      { text: "Custom reporting & dashboards", available: true },
      { text: "Advanced API access", available: true },
      { text: "Dedicated account manager", available: true },
      { text: "Legal compliance documentation", available: true }
    ],
    cta: "Contact Sales",
    variant: "outline",
    accentColor: "text-primary",
    sortOrder: 3,
    isActive: true,
    isPopular: false
  }
];

async function seedPricingPlans() {
  try {
    console.log('🌱 Starting to seed pricing plans...');
    
    // Clear existing pricing plans
    await db.delete(pricingPlans);
    console.log('✨ Cleared existing pricing plans');
    
    // Insert the three specified plans
    const insertedPlans = await db.insert(pricingPlans).values(plansToInsert).returning();
    
    console.log('🎉 Successfully inserted pricing plans:');
    insertedPlans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.name} - ${plan.price}/${plan.period} ${plan.isPopular ? '(Popular)' : ''}`);
    });
    
    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding pricing plans:', error);
    throw error;
  }
}

// Run the seeding
seedPricingPlans()
  .then(() => {
    console.log('🎯 All done! Pricing plans are now in the database.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to seed pricing plans:', error);
    process.exit(1);
  });