import { useState, useEffect } from 'react';
import { MapPin, X, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationPermissionBannerProps {
  onLocationDetected: (region: string, country?: string) => void;
  onDismiss: () => void;
}

export function LocationPermissionBanner({ onLocationDetected, onDismiss }: LocationPermissionBannerProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    region: string;
    country?: string;
    method: 'geolocation' | 'ip' | 'default';
  } | null>(null);

  // Auto-detect location on mount
  useEffect(() => {
    handleDetectLocation();
  }, []);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    
    try {
      const { getRegionFromGeolocation } = await import('../utils/geolocation');
      const result = await getRegionFromGeolocation();
      
      setDetectionResult(result);
      onLocationDetected(result.region, result.country);
      
      // Auto-dismiss after showing success
      setTimeout(() => {
        onDismiss();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to detect location:', error);
      // Fallback to global region
      onLocationDetected('global');
      onDismiss();
    } finally {
      setIsDetecting(false);
    }
  };

  if (detectionResult) {
    const getRegionDisplayName = (region: string) => {
      const regionMap: Record<string, string> = {
        'eu': 'EU',
        'uk': 'UK', 
        'usa': 'USA',
        'canada': 'Canada',
        'australia': 'Australia',
        'japan': 'Japan',
        'global': 'Global'
      };
      return regionMap[region] || region.toUpperCase();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Location detected! Region set to {getRegionDisplayName(detectionResult.region)}
                {detectionResult.country && detectionResult.method !== 'default' && (
                  <span className="ml-1">({detectionResult.country})</span>
                )}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {detectionResult.method === 'ip' ? 'Detected from IP address' : 
                 detectionResult.method === 'geolocation' ? 'Detected from GPS location' : 
                 'Using global standards (location detection failed)'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Detecting your location...
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Auto-selecting the appropriate accessibility standards for your region
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-4 text-blue-400 hover:text-blue-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}