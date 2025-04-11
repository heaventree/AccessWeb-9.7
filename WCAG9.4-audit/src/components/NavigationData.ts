export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavItem[];
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  };
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavItem[];
}

export const tools: NavItem[] = [
  {
    id: 'wcag-checker',
    label: 'WCAG Checker',
    href: '/checker',
    icon: 'check-circle',
  },
  {
    id: 'wcag-standards',
    label: 'WCAG Standards',
    href: '/tools/wcag-standards',
    icon: 'book',
  },
  {
    id: 'color-palette',
    label: 'Color Palette',
    href: '/tools/colors',
    icon: 'palette',
  },
  {
    id: 'color-simulator',
    label: 'Color Simulator',
    href: '/tools/color-simulator',
    icon: 'eye',
  },
  {
    id: 'monitoring',
    label: 'Accessibility Monitoring',
    href: '/tools/monitoring',
    icon: 'activity',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
  {
    id: 'realtime',
    label: 'Real-Time Monitor',
    href: '/tools/realtime',
    icon: 'zap',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
  {
    id: 'image-alt-scanner',
    label: 'Image Alt Scanner',
    href: '/tools/image-alt-scanner',
    icon: 'image',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/tools/analytics',
    icon: 'bar-chart',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
  {
    id: 'compliance',
    label: 'Compliance',
    href: '/tools/compliance',
    icon: 'shield',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
];

export const integrations: NavItem[] = [
  {
    id: 'wordpress',
    label: 'WordPress',
    href: '/integrations/wordpress',
    icon: 'wordpress',
  },
  {
    id: 'shopify',
    label: 'Shopify',
    href: '/integrations/shopify',
    icon: 'shopping-bag',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
  {
    id: 'api',
    label: 'API Integration',
    href: '/integrations/api',
    icon: 'code',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
  {
    id: 'compliance-integration',
    label: 'Compliance Integration',
    href: '/integrations/compliance',
    icon: 'shield',
    badge: {
      text: 'PRO',
      variant: 'primary',
    },
  },
  {
    id: 'enterprise',
    label: 'Enterprise Integration',
    href: '/integrations/enterprise',
    icon: 'briefcase',
    badge: {
      text: 'ENTERPRISE',
      variant: 'warning',
    },
  },
];

export const resources: NavItem[] = [
  {
    id: 'wcag-resources',
    label: 'WCAG Resources',
    href: '/wcag-resources',
    icon: 'book-open',
  },
  {
    id: 'alt-text-guide',
    label: 'Alt Text Guide',
    href: '/wcag-resources/alt-text-guide',
    icon: 'image',
  },
  {
    id: 'accessibility-tips',
    label: 'Accessibility Tips',
    href: '/wcag-resources/accessibility-tips',
    icon: 'info',
  },
  {
    id: 'non-destructive-fixes',
    label: 'Non-Destructive Fixes',
    href: '/wcag-resources/non-destructive-fixes',
    icon: 'tool',
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    icon: 'rss',
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    href: '/knowledge-base',
    icon: 'database',
  },
  {
    id: 'help-center',
    label: 'Help Center',
    href: '/help',
    icon: 'help-circle',
  },
];

export const navigationSections: NavigationSection[] = [
  {
    id: 'tools',
    title: 'Tools',
    items: tools,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    items: integrations,
  },
  {
    id: 'resources',
    title: 'Resources',
    items: resources,
  },
];

export const accountItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/my-account',
    icon: 'home',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    href: '/my-account/monitoring',
    icon: 'activity',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/my-account/analytics',
    icon: 'bar-chart',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    href: '/my-account/alerts',
    icon: 'bell',
  },
  {
    id: 'connections',
    label: 'Connections',
    href: '/my-account/connections',
    icon: 'link',
    children: [
      {
        id: 'custom-api',
        label: 'Custom API',
        href: '/my-account/connections/custom-api',
        icon: 'code',
      },
      {
        id: 'shopify',
        label: 'Shopify',
        href: '/my-account/connections/shopify',
        icon: 'shopping-bag',
      },
      {
        id: 'wordpress',
        label: 'WordPress',
        href: '/my-account/connections/wordpress',
        icon: 'wordpress',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    href: '/my-account/billing',
    icon: 'credit-card',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/my-account/settings',
    icon: 'settings',
  },
  {
    id: 'team',
    label: 'Team',
    href: '/my-account/team',
    icon: 'users',
  },
];