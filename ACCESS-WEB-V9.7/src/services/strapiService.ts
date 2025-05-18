import axios from 'axios';

// Define the base URL for your Strapi API
const API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337/api';

// Create an axios instance for Strapi
const strapiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define TypeScript interfaces for your Strapi content types
export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
}

export interface StrapiPageAttributes {
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  sections: any[];
  seo: StrapiSEO;
  layout: string;
}

export interface StrapiSEO {
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  metaRobots?: string;
  structuredData?: any;
  metaViewport?: string;
  canonicalURL?: string;
  metaImage?: {
    data?: {
      attributes: {
        url: string;
        width: number;
        height: number;
        alternativeText?: string;
      }
    }
  };
}

export interface StrapiNavigationAttributes {
  items: StrapiMenuItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiMenuItem {
  id: number;
  label: string;
  url?: string;
  target?: string;
  icon?: string;
  isButton?: boolean;
  order?: number;
  children?: StrapiMenuItem[];
  page?: {
    data?: {
      id: number;
      attributes: {
        slug: string;
      }
    }
  };
}

/**
 * Fetch all pages from Strapi
 */
export const getPages = async (): Promise<StrapiPageAttributes[]> => {
  try {
    const response = await strapiClient.get<StrapiResponse<StrapiPageAttributes>>('/pages', {
      params: {
        populate: {
          seo: {
            populate: '*'
          }
        }
      }
    });
    
    return response.data.data.map(item => item.attributes);
  } catch (error) {
    console.error('Error fetching pages from Strapi:', error);
    return [];
  }
};

/**
 * Fetch a single page by slug
 */
export const getPageBySlug = async (slug: string): Promise<StrapiPageAttributes | null> => {
  try {
    const response = await strapiClient.get<StrapiResponse<StrapiPageAttributes>>('/pages', {
      params: {
        filters: {
          slug: {
            $eq: slug
          }
        },
        populate: {
          sections: {
            populate: '*'
          },
          seo: {
            populate: '*'
          }
        }
      }
    });
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0].attributes;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug} from Strapi:`, error);
    return null;
  }
};

/**
 * Fetch navigation from Strapi
 */
export const getNavigation = async (): Promise<StrapiNavigationAttributes | null> => {
  try {
    const response = await strapiClient.get<StrapiSingleResponse<StrapiNavigationAttributes>>('/navigation', {
      params: {
        populate: {
          items: {
            populate: {
              page: true,
              children: {
                populate: '*'
              }
            }
          }
        }
      }
    });
    
    return response.data.data.attributes;
  } catch (error) {
    console.error('Error fetching navigation from Strapi:', error);
    return null;
  }
};

export default {
  getPages,
  getPageBySlug,
  getNavigation,
};