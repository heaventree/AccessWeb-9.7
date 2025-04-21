
import axios from 'axios';
import type { CMSPage } from '../types';

const strapiUrl = process.env.STRAPI_URL || 'http://0.0.0.0:1337';
const apiUrl = `${strapiUrl}/api`;

export const strapiCmsService = {
  getAllPages: async (): Promise<CMSPage[]> => {
    try {
      const response = await axios.get(`${apiUrl}/pages`);
      return response.data.data.map(mapStrapiPageToAppPage);
    } catch (error) {
      console.error("Error fetching pages from Strapi:", error);
      return [];
    }
  },

  getPageById: async (id: string): Promise<CMSPage | null> => {
    try {
      const response = await axios.get(`${apiUrl}/pages/${id}`);
      return mapStrapiPageToAppPage(response.data.data);
    } catch (error) {
      console.error(`Error fetching page ${id} from Strapi:`, error);
      return null;
    }
  },

  getPageBySlug: async (slug: string): Promise<CMSPage | null> => {
    try {
      const response = await axios.get(`${apiUrl}/pages`, {
        params: {
          filters: {
            slug: {
              $eq: slug
            }
          }
        }
      });
      
      if (response.data.data.length === 0) return null;
      return mapStrapiPageToAppPage(response.data.data[0]);
    } catch (error) {
      console.error(`Error fetching page by slug ${slug} from Strapi:`, error);
      return null;
    }
  },

  createPage: async (data: Omit<CMSPage, 'id' | 'slug' | 'lastModified' | 'isPublished'>): Promise<CMSPage> => {
    try {
      const strapiData = {
        data: {
          title: data.title,
          content: data.content,
          isPublished: false
        }
      };
      
      const response = await axios.post(`${apiUrl}/pages`, strapiData);
      return mapStrapiPageToAppPage(response.data.data);
    } catch (error) {
      console.error("Error creating page in Strapi:", error);
      throw error;
    }
  },

  updatePage: async (id: string, data: Partial<CMSPage>): Promise<CMSPage | null> => {
    try {
      const strapiData = {
        data: {
          ...(data.title && { title: data.title }),
          ...(data.content && { content: data.content }),
          ...(data.isPublished !== undefined && { isPublished: data.isPublished })
        }
      };
      
      const response = await axios.put(`${apiUrl}/pages/${id}`, strapiData);
      return mapStrapiPageToAppPage(response.data.data);
    } catch (error) {
      console.error(`Error updating page ${id} in Strapi:`, error);
      return null;
    }
  },

  deletePage: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${apiUrl}/pages/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting page ${id} from Strapi:`, error);
      return false;
    }
  },

  togglePublished: async (id: string): Promise<CMSPage | null> => {
    try {
      // First get the current page to determine its published state
      const page = await strapiCmsService.getPageById(id);
      if (!page) return null;
      
      // Then toggle the published state
      return strapiCmsService.updatePage(id, { 
        isPublished: !page.isPublished 
      });
    } catch (error) {
      console.error(`Error toggling published state for page ${id} in Strapi:`, error);
      return null;
    }
  },

  searchPages: async (query: string): Promise<CMSPage[]> => {
    try {
      const response = await axios.get(`${apiUrl}/pages`, {
        params: {
          filters: {
            $or: [
              { title: { $containsi: query } },
              { content: { $containsi: query } }
            ]
          }
        }
      });
      
      return response.data.data.map(mapStrapiPageToAppPage);
    } catch (error) {
      console.error(`Error searching pages with query "${query}" in Strapi:`, error);
      return [];
    }
  }
};

// Helper function to map Strapi data structure to our application's structure
function mapStrapiPageToAppPage(strapiPage: any): CMSPage {
  const attributes = strapiPage.attributes;
  return {
    id: strapiPage.id.toString(),
    title: attributes.title,
    content: attributes.content,
    slug: attributes.slug,
    lastModified: attributes.updatedAt,
    isPublished: attributes.isPublished || false
  };
}
