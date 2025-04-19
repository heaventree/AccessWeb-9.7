// Mock data service to use when database is unavailable
import type { HelpArticle, HelpCategory } from '../types/help';
import { articles } from '../data/articles';

const mockCategories: HelpCategory[] = [
  {
    id: '1',
    name: 'WCAG Standards',
    description: 'Understanding WCAG 2.1 principles and requirements',
    icon: 'Book',
    articles: [
      { id: '1', title: 'WCAG 2.1 Guide', slug: 'complete-guide-wcag-2-1-accessibility-standards' },
      { id: '2', title: 'Perceivable Principle', slug: 'wcag-2-1-perceivable-understanding-the-first-principle' },
      { id: '3', title: 'Operable Principle', slug: 'wcag-2-1-operable-understanding-the-second-principle' },
      { id: '4', title: 'Understandable Principle', slug: 'wcag-2-1-understandable-understanding-the-third-principle' },
      { id: '5', title: 'Robust Principle', slug: 'wcag-2-1-robust-understanding-the-fourth-principle' }
    ]
  },
  {
    id: '2', 
    name: 'Best Practices',
    description: 'Implementation guides and technical best practices',
    icon: 'FileText',
    articles: [
      { id: '6', title: 'Implementation Guide', slug: 'web-accessibility-implementation-best-practices' },
      { id: '7', title: 'WCAG Best Practices', slug: 'wcag-2-1-best-practices-and-patterns' },
      { id: '8', title: 'ADA Best Practices', slug: 'ada-compliance-best-practices-implementation' },
      { id: '9', title: 'EAA Best Practices', slug: 'european-accessibility-act-best-practices-implementation' },
      { id: '10', title: 'Section 508 Best Practices', slug: 'section-508-compliance-best-practices-implementation' }
    ]
  },
  {
    id: '3',
    name: 'Accessibility Standards',
    description: 'Comprehensive guides to accessibility regulations',
    icon: 'Shield',
    articles: [
      { id: '11', title: 'ADA Compliance Guide', slug: 'ada-compliance-digital-accessibility-requirements' },
      { id: '12', title: 'EAA Guide', slug: 'european-accessibility-act-complete-guide' },
      { id: '13', title: 'Section 508 Guide', slug: 'section-508-compliance-complete-guide' }
    ]
  }
];

// Convert blog articles to help articles
const mockArticles: HelpArticle[] = articles.map((article, index) => ({
  id: (index + 1).toString(),
  slug: article.slug,
  title: article.title,
  content: article.content,
  category: article.category === 'wcag' ? 'WCAG Standards' :
           article.category === 'best-practices' ? 'Best Practices' :
           'Accessibility Standards',
  authorId: '1',
  published: true,
  createdAt: article.publishedAt,
  updatedAt: article.publishedAt,
  views: Math.floor(Math.random() * 500),
  helpfulVotes: Math.floor(Math.random() * 50),
  unhelpfulVotes: Math.floor(Math.random() * 10)
}));

export const mockDataService = {
  getCategories: async () => mockCategories,
  getArticles: async () => mockArticles,
  getArticleBySlug: async (slug: string) => 
    mockArticles.find(article => article.slug === slug) || null,
  voteHelpful: async (slug: string, helpful: boolean) => {
    const article = mockArticles.find(a => a.slug === slug);
    if (article) {
      if (helpful) {
        article.helpfulVotes++;
      } else {
        article.unhelpfulVotes++;
      }
    }
    return true;
  }
};