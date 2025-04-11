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

// Tool navigation items
export const tools: NavItem[] = [
  {
    id: 'checker',
    label: 'Accessibility Checker',
    icon: 'check-circle',
    href: '/checker',
    badge: {
      text: 'Popular',
      variant: 'primary',
    },
  },
  {
    id: 'color-contrast',
    label: 'Color Contrast Checker',
    icon: 'palette',
    href: '/tools/color-contrast',
  },
  {
    id: 'image-analyzer',
    label: 'Image Accessibility Analyzer',
    icon: 'image',
    href: '/tools/image-analyzer', 
  },
  {
    id: 'form-tester',
    label: 'Form Accessibility Tester',
    icon: 'activity',
    href: '/tools/form-tester',
  },
  {
    id: 'keyboard-navigator',
    label: 'Keyboard Navigation Tester',
    icon: 'zap',
    href: '/tools/keyboard-navigator',
  },
];

// Integration navigation items
export const integrations: NavItem[] = [
  {
    id: 'cms',
    label: 'CMS Plugins',
    icon: 'database',
    href: '/integrations/cms',
  },
  {
    id: 'development',
    label: 'Development Tools',
    icon: 'code',
    href: '/integrations/development',
    badge: {
      text: 'New',
      variant: 'primary',
    },
  },
  {
    id: 'reporting',
    label: 'Reporting Tools',
    icon: 'bar-chart',
    href: '/integrations/reporting',
  },
  {
    id: 'design',
    label: 'Design Tool Integration',
    icon: 'eye',
    href: '/integrations/design',
  },
  {
    id: 'api',
    label: 'API Access',
    icon: 'link',
    href: '/integrations/api',
  },
];

// Resource navigation items
export const resources: NavItem[] = [
  {
    id: 'documentation',
    label: 'Documentation',
    icon: 'book-open',
    href: '/docs',
  },
  {
    id: 'wcag-resources',
    label: 'WCAG Resources',
    icon: 'book',
    href: '/wcag-resources',
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: 'rss',
    href: '/blog',
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    icon: 'info',
    href: '/knowledge-base',
  },
  {
    id: 'help-center',
    label: 'Help Center',
    icon: 'help-circle',
    href: '/help',
  },
];

// Combined sections for sidebar navigation
export const navigationSections: NavigationSection[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'home',
        href: '/dashboard',
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: 'briefcase',
        href: '/projects',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'bell',
        href: '/notifications',
        badge: {
          text: '3',
          variant: 'primary',
        },
      },
    ],
  },
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

// Account menu items
export const accountItems: NavItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'users',
    href: '/profile',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'credit-card',
    href: '/billing',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    href: '/settings',
  },
];