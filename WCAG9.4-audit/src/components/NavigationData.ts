import { 
  Gauge, 
  Palette, 
  FileText, 
  Zap, 
  Settings, 
  Store, 
  Globe, 
  Activity, 
  ActivitySquare, 
  Book, 
  HelpCircle, 
  BarChart2, 
  Bell, 
  Shield, 
  Building, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Image
} from 'lucide-react';

/**
 * This file extracts navigation data from the original Navigation.tsx component
 * to make it available for both Navigation and EnhancedNavigation components.
 * This reduces duplication and ensures consistency when switching between UI versions.
 */

export const tools = [
  { 
    name: 'WCAG Checker',
    path: '/checker',
    icon: Gauge,
    description: 'Test your website against WCAG standards'
  },
  { 
    name: 'Color Palette',
    path: '/tools/colors',
    icon: Palette,
    description: 'Create accessible color combinations'
  },
  { 
    name: 'Color Accessibility Simulator',
    path: '/tools/color-simulator',
    icon: Palette,
    description: 'Test colors for accessibility and simulate color blindness'
  },
  { 
    name: 'WCAG Standards',
    path: '/tools/wcag-standards',
    icon: FileText,
    description: 'Browse WCAG 2.1 standards and requirements'
  },
  { 
    name: 'Image Alt Scanner',
    path: '/tools/image-alt-scanner',
    icon: Image,
    description: 'Find and fix image accessibility issues'
  }
];

export const integrations = [
  {
    name: 'Shopify',
    path: '/integrations/shopify',
    icon: Store,
    description: 'Shopify theme accessibility'
  },
  {
    name: 'WordPress',
    path: '/wordpressint',
    icon: Globe,
    description: 'WordPress site accessibility'
  },
  {
    name: 'Custom API',
    path: '/integrations/api',
    icon: Activity,
    description: 'API integration & webhooks'
  },
  {
    name: 'Compliance',
    path: '/integrations/compliance',
    icon: Shield,
    description: 'Compliance monitoring & reporting'
  },
  {
    name: 'Enterprise',
    path: '/integrations/enterprise',
    icon: Building,
    description: 'Enterprise-grade solutions'
  }
];

export const resources = [
  {
    name: 'Documentation',
    path: '/docs',
    icon: Book,
    description: 'Technical guides and API docs'
  },
  {
    name: 'Help Center',
    path: '/help',
    icon: HelpCircle,
    description: 'FAQs and troubleshooting'
  },
  {
    name: 'Non-Destructive Fixes',
    path: '/non-destructive-fixes',
    icon: Zap,
    description: 'CSS-based accessibility fixes'
  },
  {
    name: 'Blog',
    path: '/blog',
    icon: FileText,
    description: 'Articles and updates'
  }
];

export const accountItems = [
  {
    name: 'Account Dashboard',
    path: '/my-account',
    icon: LayoutDashboard,
    description: 'View your account dashboard'
  },
  {
    name: 'Monitoring & Compliance',
    path: '/my-account/monitoring',
    icon: ActivitySquare,
    description: 'Real-time monitoring & compliance'
  },
  {
    name: 'Analytics',
    path: '/my-account/analytics',
    icon: BarChart2,
    description: 'Accessibility analytics and insights'
  },
  {
    name: 'Alerts',
    path: '/my-account/alerts',
    icon: Bell,
    description: 'Configure accessibility alerts'
  },
  {
    name: 'Connections',
    path: '/my-account/connections',
    icon: Globe,
    description: 'Manage API and platform connections'
  },
  {
    name: 'Settings',
    path: '/my-account/settings',
    icon: Settings,
    description: 'Manage account settings'
  },
  {
    name: 'Billing',
    path: '/my-account/billing',
    icon: CreditCard,
    description: 'Manage billing and subscriptions'
  },
  {
    name: 'Team',
    path: '/my-account/team',
    icon: Users,
    description: 'Manage team members'
  }
];