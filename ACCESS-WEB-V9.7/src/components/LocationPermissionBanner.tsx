import { useState } from 'react';
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
                Location detected! 
                {detectionResult.country && (
                  <span className="ml-1">Region set to {detectionResult.region.toUpperCase()}</span>
                )}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Detection method: {detectionResult.method === 'geolocation' ? 'GPS location' : detectionResult.method === 'ip' ? 'IP address' : 'default'}
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
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Auto-select your region
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              We can detect your location to automatically select the appropriate accessibility standards for your region.
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <button
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetecting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Detecting...
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3 mr-2" />
                    Detect Location
                  </>
                )}
              </button>
              <button
                onClick={onDismiss}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                No thanks, I'll select manually
              </button>
            </div>
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