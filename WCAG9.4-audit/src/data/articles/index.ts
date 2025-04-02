import { perceivableArticle } from './wcag-1-perceivable';
import { operableArticle } from './wcag-2-operable';
import { understandableArticle } from './wcag-3-understandable';
import { robustArticle } from './wcag-4-robust';
import { wcagGuideArticle } from './accessibility-standards/wcag-2-1-guide';
import { adaComplianceArticle } from './accessibility-standards/ada-compliance';
import { eaaGuideArticle } from './accessibility-standards/eaa-guide';
import { section508GuideArticle } from './accessibility-standards/section-508-guide';
import { wcagBeginnersGuide } from './wcag/beginners-guide';
import { wcagImplementationTutorial } from './wcag/implementation-tutorial';
import { wcagAuditGuide } from './wcag/audit-guide';
import { wcagMobileAccessibility } from './wcag/mobile-accessibility';
import { wcagColorContrast } from './wcag/color-contrast';
import { implementationGuideArticle } from './best-practices/implementation-guide';
import { wcagBestPractices } from './best-practices/wcag-best-practices';
import { adaBestPractices } from './best-practices/ada-best-practices';
import { eaaBestPractices } from './best-practices/eaa-best-practices';
import { section508BestPractices } from './best-practices/section-508-best-practices';
import { wordpressIntegrationGuide } from './integrations/wordpress-integration-guide';
import { shopifyIntegrationGuide } from './integrations/shopify-integration-guide';
import { customApiGuide } from './integrations/custom-api-guide';
// WCAG Resources (Educational Content)
import { wcagPerceivablePrincipleGuide } from './wcag-resources/wcag-perceivable-principle';
import type { Article } from '../../types/blog';

export const articles: Article[] = [
  perceivableArticle,
  operableArticle,
  understandableArticle,
  robustArticle,
  wcagGuideArticle,
  adaComplianceArticle,
  eaaGuideArticle,
  section508GuideArticle,
  wcagBeginnersGuide,
  wcagImplementationTutorial,
  wcagAuditGuide,
  wcagMobileAccessibility,
  wcagColorContrast,
  implementationGuideArticle,
  wcagBestPractices,
  adaBestPractices,
  eaaBestPractices,
  section508BestPractices,
  wordpressIntegrationGuide,
  shopifyIntegrationGuide,
  customApiGuide,
  // WCAG Resources (Educational Content)
  wcagPerceivablePrincipleGuide
];

// Include the WCAG resource article in featured articles
export const featuredArticles = [
  wcagPerceivablePrincipleGuide,
  ...articles.filter(article => article.id !== wcagPerceivablePrincipleGuide.id).slice(0, 1)
];
export const latestArticles = articles.sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);