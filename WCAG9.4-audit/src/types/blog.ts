interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: 'wcag' | 'accessibility' | 'best-practices';
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readingTime: string;
  vectorImage: string;
  relatedArticles?: string[];
  wcagReference?: string;
  tableOfContents: {
    id: string;
    title: string;
    level: number;
  }[];
}

interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  count: number;
}

export type { Article, ArticleCategory };