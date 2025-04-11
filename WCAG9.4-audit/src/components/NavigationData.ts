// Types
export interface Badge {
  text: string;
  variant: 'primary' | 'secondary' | 'warning' | 'success' | 'danger';
}

export interface NavItem {
  id: string;
  href?: string;
  label: string;
  icon?: string;
  description?: string;
  badge?: Badge;
}

// Tools navigation data
export const tools: NavItem[] = [
  {
    id: 'wcag-checker',
    href: '/checker',
    label: 'WCAG Checker',
    icon: 'shield',
    description: 'Analyze and fix accessibility issues',
    badge: {
      text: 'Popular',
      variant: 'primary'
    }
  },
  {
    id: 'wcag-standards',
    href: '/tools/wcag-standards',
    label: 'WCAG Standards',
    icon: 'book-open',
    description: 'Browse accessibility guidelines'
  },
  {
    id: 'colors',
    href: '/tools/colors',
    label: 'Color Palette',
    icon: 'palette',
    description: 'Create accessible color schemes'
  },
  {
    id: 'color-simulator',
    href: '/tools/color-simulator',
    label: 'Color Simulator',
    icon: 'eye',
    description: 'Visualize color perception',
    badge: {
      text: 'New',
      variant: 'primary'
    }
  },
  {
    id: 'monitoring',
    href: '/tools/monitoring',
    label: 'Monitoring',
    icon: 'activity',
    description: 'Track accessibility over time'
  },
  {
    id: 'realtime',
    href: '/tools/realtime',
    label: 'Real-time Monitor',
    icon: 'zap',
    description: 'Live accessibility monitoring',
    badge: {
      text: 'PRO',
      variant: 'warning'
    }
  },
  {
    id: 'image-alt',
    href: '/tools/image-alt-scanner',
    label: 'Image Alt Scanner',
    icon: 'image',
    description: 'Check and fix image descriptions'
  },
  {
    id: 'analytics',
    href: '/tools/analytics',
    label: 'Analytics',
    icon: 'bar-chart',
    description: 'Accessibility metrics and insights',
    badge: {
      text: 'PRO',
      variant: 'warning'
    }
  },
];

// Integrations navigation data
export const integrations: NavItem[] = [
  {
    id: 'wordpress',
    href: '/integrations/wordpress',
    label: 'WordPress',
    icon: 'code',
    description: 'Improve your WordPress site'
  },
  {
    id: 'shopify',
    href: '/integrations/shopify',
    label: 'Shopify',
    icon: 'shopping-bag',
    description: 'Create accessible stores',
    badge: {
      text: 'PRO',
      variant: 'warning'
    }
  },
  {
    id: 'api-integration',
    href: '/integrations/api',
    label: 'API',
    icon: 'code',
    description: 'Access our API endpoints'
  },
  {
    id: 'compliance',
    href: '/integrations/compliance',
    label: 'Compliance',
    icon: 'check-circle',
    description: 'Automated compliance checks',
    badge: {
      text: 'PRO',
      variant: 'warning'
    }
  },
  {
    id: 'enterprise',
    href: '/integrations/enterprise',
    label: 'Enterprise',
    icon: 'briefcase',
    description: 'Solutions for large businesses',
    badge: {
      text: 'Enterprise',
      variant: 'primary'
    }
  },
];

// Resources navigation data
export const resources: NavItem[] = [
  {
    id: 'documentation',
    href: '/docs',
    label: 'Documentation',
    icon: 'book',
    description: 'How to use our tools'
  },
  {
    id: 'wcag-resources',
    href: '/wcag-resources',
    label: 'WCAG Resources',
    icon: 'info',
    description: 'Accessibility guidelines'
  },
  {
    id: 'blog',
    href: '/blog',
    label: 'Blog',
    icon: 'rss',
    description: 'News and articles'
  },
  {
    id: 'knowledge-base',
    href: '/knowledge-base',
    label: 'Knowledge Base',
    icon: 'database',
    description: 'Tutorials and guides'
  },
  {
    id: 'help-center',
    href: '/help',
    label: 'Help Center',
    icon: 'help-circle',
    description: 'FAQs and support'
  },
];

// Account navigation sections
export const navigationSections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    items: [
      {
        id: 'home',
        href: '/my-account',
        label: 'Home',
        icon: 'home'
      },
      {
        id: 'notifications',
        href: '/my-account/notifications',
        label: 'Notifications',
        icon: 'bell',
        badge: {
          text: '3',
          variant: 'primary'
        }
      },
    ]
  },
  {
    id: 'tools',
    title: 'Tools',
    items: tools
  },
  {
    id: 'connections',
    title: 'Connections',
    items: [
      {
        id: 'connections',
        href: '/my-account/connections',
        label: 'All Connections',
        icon: 'link'
      },
      {
        id: 'custom-api',
        href: '/my-account/connections/custom-api',
        label: 'Custom API',
        icon: 'code'
      },
      {
        id: 'shopify-connection',
        href: '/my-account/connections/shopify',
        label: 'Shopify',
        icon: 'shopping-bag'
      },
      {
        id: 'wordpress-connection',
        href: '/my-account/connections/wordpress',
        label: 'WordPress',
        icon: 'code'
      },
    ]
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'billing',
        href: '/my-account/billing',
        label: 'Billing',
        icon: 'credit-card'
      },
      {
        id: 'settings',
        href: '/my-account/settings',
        label: 'Settings',
        icon: 'settings'
      },
      {
        id: 'team',
        href: '/my-account/team',
        label: 'Team',
        icon: 'users'
      },
    ]
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        id: 'help',
        href: '/help',
        label: 'Help Center',
        icon: 'help-circle'
      },
      {
        id: 'support-chat',
        href: '#support-chat',
        label: 'Chat with Support',
        icon: 'message-square'
      },
    ]
  },
];

// Account menu items
export const accountItems: NavItem[] = [
  {
    id: 'profile',
    href: '/my-account/settings',
    label: 'My Profile',
    icon: 'user'
  },
  {
    id: 'billing',
    href: '/my-account/billing',
    label: 'Billing',
    icon: 'credit-card'
  },
  {
    id: 'team',
    href: '/my-account/team',
    label: 'Team',
    icon: 'users'
  },
  {
    id: 'settings',
    href: '/my-account/settings',
    label: 'Settings',
    icon: 'settings'
  },
];