import React from 'react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { BackToTop } from '../../components/BackToTop';
import { WordPressSettings as WordPressSettingsComponent } from '../../components/integrations/WordPressSettings';
import { wordPressAPI } from '../../lib/integrations/wordpress';
import { useSettings } from '../../hooks/useSettings';
import type { WordPressSettings } from '../../types/integrations';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const defaultSettings: WordPressSettings = {
  apiKey: '',
  scanFrequency: 'weekly',
  autoFix: true,
  notifyAdmin: true,
  excludedPaths: []
};

export function WordPressAPIPage() {
  const { settings: globalSettings, updateSettings } = useSettings();
  const [settings, setSettings] = useState<WordPressSettings>(
    globalSettings.wordpress || defaultSettings
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await wordPressAPI.getSettings();
      if (savedSettings) {
        const newSettings = { ...savedSettings };
        setSettings(newSettings);
        updateSettings('wordpress', newSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (newSettings: WordPressSettings) => {
    try {
      // Validate API key
      const isValid = await wordPressAPI.validateAPIKey(newSettings.apiKey);
      if (!isValid) {
        throw new Error('Invalid API key');
      }

      // Save settings
      const result = await wordPressAPI.saveSettings(newSettings);
      if (result.success) {
        setSettings(newSettings);
        updateSettings('wordpress', newSettings);
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
              WordPress API Integration
            </h1>
            <p className="text-lg text-gray-600">
              Configure your WordPress site integration and monitoring settings
            </p>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <WordPressSettingsComponent 
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