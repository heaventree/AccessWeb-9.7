import React from 'react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { BackToTop } from '../../components/BackToTop';
import { ShopifySettings as ShopifySettingsForm } from '../../components/integrations/ShopifySettings';
import { shopifyAPI } from '../../lib/integrations/shopify';
import { useSettings } from '../../hooks/useSettings';
import type { ShopifySettings } from '../../types/integrations';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { queryClient } from '../../providers/AppProvider';

const defaultSettings: ShopifySettings = {
  apiKey: '',
  shop: '',
  accessToken: '',
  scanFrequency: 'weekly',
  autoFix: true,
  notifyAdmin: true,
  excludedPaths: [],
  theme: {
    id: '',
    name: ''
  }
};

export function ShopifyAPIPage() {
  const { settings: globalSettings, updateSettings } = useSettings();
  const [settings, setSettings] = useState<ShopifySettings>(
    globalSettings.shopify || defaultSettings
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (globalSettings.shopify) {
      setSettings(globalSettings.shopify);
    }
  }, [globalSettings.shopify]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await shopifyAPI.getSettings();
      if (savedSettings) {
        const newSettings = { ...savedSettings };
        setSettings(newSettings);
        await updateSettings('shopify', newSettings);
        
        // Force refresh
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (newSettings: ShopifySettings) => {
    try {
      // Validate credentials
      const isValid = await shopifyAPI.validateCredentials(
        newSettings.shop,
        newSettings.accessToken
      );
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Get current theme
      const theme = await shopifyAPI.getCurrentTheme(
        newSettings.shop,
        newSettings.accessToken
      );

      // Save settings
      const result = await shopifyAPI.saveSettings({
        ...newSettings,
        theme
      });

      if (result.success) {
        const updatedSettings = { ...newSettings, theme };
        setSettings(updatedSettings);
        await updateSettings('shopify', updatedSettings);
        
        // Force refresh
        queryClient.invalidateQueries({ queryKey: ['settings'] });
        
        toast.success('Settings saved successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(message);
      throw error;
    }
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
        <div className="content-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Shopify API Integration
            </h1>
            <p className="text-lg text-gray-600">
              Configure your Shopify store integration and monitoring settings
            </p>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ShopifySettingsForm 
                settings={settings} 
                onSave={handleSaveSettings} 
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}