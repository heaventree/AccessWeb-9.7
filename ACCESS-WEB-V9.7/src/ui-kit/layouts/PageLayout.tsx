/**
 * ACCESS-WEB UI Kit - Page Layout
 * 
 * A standard page layout component with consistent structure.
 */

import React from 'react';
import { cn } from '../styles/utils';
import { Main } from '../components/Container/Container';

/**
 * PageLayout props
 */
export interface PageLayoutProps {
  /** Page header component */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Page footer component */
  footer?: React.ReactNode;
  /** Additional class names for the page container */
  className?: string;
  /** Additional class names for the main content area */
  mainClassName?: string;
}

/**
 * StandardPageLayout component
 * 
 * Provides a consistent layout structure for all pages.
 */
export function PageLayout({
  header,
  children,
  footer,
  className,
  mainClassName,
}: PageLayoutProps) {
  return (
    <div className={cn('flex flex-col min-h-screen', className)}>
      {header}
      <Main className={mainClassName}>{children}</Main>
      {footer}
    </div>
  );
}

/**
 * PageHeader props
 */
export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle or description */
  description?: string;
  /** Optional actions (usually buttons) */
  actions?: React.ReactNode;
  /** Optional breadcrumbs */
  breadcrumbs?: React.ReactNode;
  /** Optional back button */
  backButton?: React.ReactNode;
  /** Background style */
  background?: 'none' | 'light' | 'brand';
  /** Additional class names */
  className?: string;
}

/**
 * PageHeader component
 * 
 * Standard page header with title, description, and actions.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  backButton,
  background = 'none',
  className,
}: PageHeaderProps) {
  const backgroundClass = {
    none: '',
    light: 'bg-gray-50 dark:bg-gray-900',
    brand: 'bg-[#0fae96]/10 dark:bg-[#0fae96]/20',
  }[background];

  return (
    <header className={cn('py-6 md:py-8', backgroundClass, className)}>
      <div className="container mx-auto px-4 md:px-6">
        {breadcrumbs && <div className="mb-4">{breadcrumbs}</div>}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {backButton}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="md:ml-auto">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

export { PageLayout, PageHeader };