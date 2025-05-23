-- Create pricing_plans table with exact structure needed
CREATE TABLE IF NOT EXISTS pricing_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(20) NOT NULL,
  period VARCHAR(20) DEFAULT 'month' NOT NULL,
  features JSONB NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  cta VARCHAR(50) DEFAULT 'Get Started' NOT NULL,
  variant VARCHAR(20) DEFAULT 'outline' NOT NULL,
  accent_color VARCHAR(50) DEFAULT 'text-primary' NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert the three exact pricing plans you specified
INSERT INTO pricing_plans (name, description, price, period, features, is_popular, cta, variant, accent_color, sort_order, is_active) VALUES
(
  'Starter',
  'Perfect for small websites and blogs',
  '$29',
  'month',
  '[
    {"text": "Up to 100 pages scanned", "available": true},
    {"text": "Weekly automated scans", "available": true},
    {"text": "Basic compliance reporting", "available": true},
    {"text": "Email support", "available": true},
    {"text": "Automated fixes", "available": false},
    {"text": "PDF export", "available": false}
  ]'::jsonb,
  false,
  'Get Started',
  'outline',
  'text-primary',
  1,
  true
),
(
  'Professional',
  'For growing businesses and e-commerce',
  '$49',
  'month',
  '[
    {"text": "Up to 500 pages scanned", "available": true},
    {"text": "Daily automated scans", "available": true},
    {"text": "Advanced compliance reporting", "available": true},
    {"text": "Automated fixes with suggestions", "available": true},
    {"text": "Priority email and chat support", "available": true},
    {"text": "PDF & CSV exports", "available": true}
  ]'::jsonb,
  true,
  'Get Started',
  'primary',
  'text-[#0fae96]',
  2,
  true
),
(
  'Enterprise',
  'For large organizations with complex needs',
  '$99',
  'month',
  '[
    {"text": "Unlimited pages scanned", "available": true},
    {"text": "Real-time compliance monitoring", "available": true},
    {"text": "Custom reporting & dashboards", "available": true},
    {"text": "Advanced API access", "available": true},
    {"text": "Dedicated account manager", "available": true},
    {"text": "Legal compliance documentation", "available": true}
  ]'::jsonb,
  false,
  'Contact Sales',
  'outline',
  'text-primary',
  3,
  true
);