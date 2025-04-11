import { 
  HomeIcon, 
  CreditCardIcon, 
  UsersIcon, 
  BarChart4Icon as ChartBarIcon,
  CheckCircleIcon,
  CogIcon,
  FileTextIcon as DocumentTextIcon,
  ServerIcon,
  ShieldCheckIcon,
  HelpCircleIcon as QuestionMarkCircleIcon,
  BookOpenIcon,
  LightbulbIcon as LightBulbIcon,
  CodeIcon
} from 'lucide-react';

export interface NavItem {
  id: string;
  name: string;
  description?: string;
  path: string;
  icon: any; // Using any here for simplicity, should be a React component
  badge?: string; 
  submenu?: NavItem[];
  isNew?: boolean;
  isPopular?: boolean;
  isPro?: boolean;
}

// Main Navigation Tools
export const toolItems: NavItem[] = [
  {
    id: 'wcag-checker',
    name: 'WCAG Checker',
    description: 'Scan your website for WCAG compliance issues',
    path: '/checker',
    icon: CheckCircleIcon,
    isPopular: true
  },
  {
    id: 'color-palette',
    name: 'Color Palette',
    description: 'Create and test accessible color combinations',
    path: '/tools/colors',
    icon: DocumentTextIcon
  },
  {
    id: 'color-simulator',
    name: 'Color Accessibility Simulator',
    description: 'Simulate different color vision deficiencies',
    path: '/tools/color-simulator',
    icon: DocumentTextIcon
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Set up continuous accessibility monitoring',
    path: '/tools/monitoring',
    icon: ServerIcon,
    isPro: true
  },
  {
    id: 'realtime',
    name: 'Real-time Monitor',
    description: 'Real-time accessibility monitoring dashboard',
    path: '/tools/realtime',
    icon: ChartBarIcon,
    isPro: true
  },
  {
    id: 'image-alt-scanner',
    name: 'Image Alt Scanner',
    description: 'Analyze images and suggest alternate text',
    path: '/tools/image-alt-scanner',
    icon: DocumentTextIcon,
    isNew: true
  }
];

// Integrations Section
export const integrationItems: NavItem[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Integrate with WordPress websites',
    path: '/integrations/wordpress',
    icon: ServerIcon
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Integrate with Shopify stores',
    path: '/integrations/shopify',
    icon: CreditCardIcon,
    isPro: true
  },
  {
    id: 'api',
    name: 'API',
    description: 'Programmatic access to accessibility features',
    path: '/integrations/api',
    icon: CodeIcon,
    isPro: true
  },
  {
    id: 'compliance',
    name: 'Compliance Tools',
    description: 'Tools for organizational compliance',
    path: '/integrations/compliance',
    icon: ShieldCheckIcon,
    isPro: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise-level integrations and support',
    path: '/integrations/enterprise',
    icon: UsersIcon,
    isPro: true
  }
];

// Resources Section
export const resourceItems: NavItem[] = [
  {
    id: 'docs',
    name: 'Documentation',
    description: 'Detailed product documentation',
    path: '/docs',
    icon: DocumentTextIcon
  },
  {
    id: 'wcag-resources',
    name: 'WCAG Resources',
    description: 'WCAG guidelines and resources',
    path: '/wcag-resources',
    icon: BookOpenIcon
  },
  {
    id: 'help',
    name: 'Help Center',
    description: 'Support articles and guides',
    path: '/help',
    icon: QuestionMarkCircleIcon
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Latest accessibility news and tips',
    path: '/blog',
    icon: DocumentTextIcon
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'In-depth articles and best practices',
    path: '/knowledge-base',
    icon: LightBulbIcon
  }
];

// Account Navigation Items
export const accountItems: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Your account overview',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Track your accessibility metrics',
    path: '/tools/analytics',
    icon: ChartBarIcon,
    isPro: true
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Manage compliance standards',
    path: '/tools/compliance',
    icon: ShieldCheckIcon,
    isPro: true
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Manage subscriptions and payment',
    path: '/billing',
    icon: CreditCardIcon
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Account settings and preferences',
    path: '/settings',
    icon: CogIcon
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Manage team members and roles',
    path: '/team',
    icon: UsersIcon,
    isPro: true
  }
];

// All navigation items combined
export const allNavigationItems = [
  ...toolItems,
  ...integrationItems,
  ...resourceItems,
  ...accountItems
];