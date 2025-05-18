import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PageFormData {
  title: string;
  slug: string;
  layout: 'default' | 'full-width' | 'sidebar';
  draftStatus: boolean;
  sections: any[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords?: string;
    metaRobots?: string;
  };
}

/**
 * Admin page for creating and editing CMS pages
 */
const PageEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    layout: 'default',
    draftStatus: true,
    sections: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      metaRobots: 'index, follow'
    }
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch page data when in edit mode
  useEffect(() => {
    const fetchPage = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/cms/pages/${id}`);
        const page = response.data.data;
        
        setFormData({
          title: page.title,
          slug: page.slug,
          layout: page.layout,
          draftStatus: page.draftStatus,
          sections: page.sections || [],
          seo: page.seo || {
            metaTitle: page.title,
            metaDescription: '',
            keywords: '',
            metaRobots: 'index, follow'
          }
        });
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching page:', err);
        setError(err.message || 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, isEditMode]);

  // Update the slug when the title changes (only for new pages)
  useEffect(() => {
    if (!isEditMode && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Prepare the data for API
      const apiData = {
        ...formData,
        publishedAt: !formData.draftStatus ? new Date().toISOString() : null
      };
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(`/api/cms/pages/${id}`, apiData);
        setSuccess('Page updated successfully!');
      } else {
        response = await axios.post('/api/cms/pages', apiData);
        setSuccess('Page created successfully!');
        
        // Redirect to edit mode for the new page
        setTimeout(() => {
          navigate(`/admin/content/edit/${response.data.data.id}`);
        }, 1500);
      }
      
    } catch (err: any) {
      console.error('Error saving page:', err);
      setError(err.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  // Simple section management for demo
  const addSection = (type: string) => {
    let newSection;
    
    switch (type) {
      case 'hero':
        newSection = {
          type: 'sections.hero-section',
          content: {
            title: 'New Hero Section',
            subtitle: 'Add a subtitle here',
            alignment: 'center',
            height: 'medium'
          }
        };
        break;
      
      case 'content':
        newSection = {
          type: 'blocks.content-block',
          content: {
            title: 'New Content Block',
            content: '<p>Add your content here...</p>',
            alignment: 'left'
          }
        };
        break;
        
      case 'features':
        newSection = {
          type: 'sections.feature-section',
          content: {
            title: 'New Feature Section',
            description: 'Add a description here',
            columns: '3',
            features: [
              {
                id: Date.now(),
                title: 'Feature 1',
                description: 'Feature description',
                icon: '✨'
              }
            ]
          }
        };
        break;
        
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { ...newSection, order: prev.sections.length }]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Page' : 'Create Page'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-xl">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-4 rounded-xl">
          <p className="text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 gap-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
            Page Information
          </h2>
          
          {/* Title input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
              required
            />
          </div>
          
          {/* Slug input */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-2">/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex-1 rounded-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
                required
              />
            </div>
          </div>
          
          {/* Layout selector */}
          <div>
            <label htmlFor="layout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Layout <span className="text-red-500">*</span>
            </label>
            <select
              id="layout"
              name="layout"
              value={formData.layout}
              onChange={handleChange}
              className="w-full rounded-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
              required
            >
              <option value="default">Default</option>
              <option value="full-width">Full Width</option>
              <option value="sidebar">With Sidebar</option>
            </select>
          </div>
          
          {/* Draft status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="draftStatus"
              name="draftStatus"
              checked={formData.draftStatus}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 dark:border-slate-600 text-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
            />
            <label htmlFor="draftStatus" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Save as draft
            </label>
          </div>
        </div>
        
        {/* SEO Settings */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
            SEO Settings
          </h2>
          
          <div>
            <label htmlFor="seo.metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="seo.metaTitle"
              name="seo.metaTitle"
              value={formData.seo.metaTitle}
              onChange={handleChange}
              className="w-full rounded-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
              required
            />
          </div>
          
          <div>
            <label htmlFor="seo.metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="seo.metaDescription"
              name="seo.metaDescription"
              value={formData.seo.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
              required
            />
          </div>
          
          <div>
            <label htmlFor="seo.keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keywords
            </label>
            <input
              type="text"
              id="seo.keywords"
              name="seo.keywords"
              value={formData.seo.keywords || ''}
              onChange={handleChange}
              className="w-full rounded-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
          
          <div>
            <label htmlFor="seo.metaRobots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Robots
            </label>
            <input
              type="text"
              id="seo.metaRobots"
              name="seo.metaRobots"
              value={formData.seo.metaRobots || ''}
              onChange={handleChange}
              className="w-full rounded-full border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-[#0fae96] focus:ring focus:ring-[#0fae96] focus:ring-opacity-20"
              placeholder="index, follow"
            />
          </div>
        </div>
        
        {/* Page Sections */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Page Sections
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => addSection('hero')}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-full"
              >
                + Hero
              </button>
              <button
                type="button"
                onClick={() => addSection('content')}
                className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-full"
              >
                + Content
              </button>
              <button
                type="button"
                onClick={() => addSection('features')}
                className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 rounded-full"
              >
                + Features
              </button>
            </div>
          </div>
          
          {formData.sections.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-slate-700 rounded-xl border border-dashed border-gray-300 dark:border-slate-600">
              <p className="text-gray-500 dark:text-gray-400">
                No sections added yet. Use the buttons above to add sections to your page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 border border-gray-200 dark:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        section.type.includes('hero') ? 'bg-blue-500' :
                        section.type.includes('content') ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}></span>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {section.type.includes('hero') ? 'Hero Section' :
                         section.type.includes('content') ? 'Content Block' :
                         'Feature Section'}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {section.type.includes('hero') && (
                      <p>Title: {section.content.title}</p>
                    )}
                    
                    {section.type.includes('content') && (
                      <p>Title: {section.content.title}</p>
                    )}
                    
                    {section.type.includes('feature') && (
                      <p>Title: {section.content.title}, Features: {section.content.features.length}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/content')}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            )}
            {isEditMode ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageEditorPage;