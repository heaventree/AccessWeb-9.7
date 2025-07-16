// Geolocation utility for auto-selecting regions based on user location

interface GeolocationResult {
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
}

// Mapping of country codes to regions
const COUNTRY_TO_REGION: Record<string, string> = {
  // European Union countries
  'AT': 'eu', // Austria
  'BE': 'eu', // Belgium
  'BG': 'eu', // Bulgaria
  'HR': 'eu', // Croatia
  'CY': 'eu', // Cyprus
  'CZ': 'eu', // Czech Republic
  'DK': 'eu', // Denmark
  'EE': 'eu', // Estonia
  'FI': 'eu', // Finland
  'FR': 'eu', // France
  'DE': 'eu', // Germany
  'GR': 'eu', // Greece
  'HU': 'eu', // Hungary
  'IE': 'eu', // Ireland
  'IT': 'eu', // Italy
  'LV': 'eu', // Latvia
  'LT': 'eu', // Lithuania
  'LU': 'eu', // Luxembourg
  'MT': 'eu', // Malta
  'NL': 'eu', // Netherlands
  'PL': 'eu', // Poland
  'PT': 'eu', // Portugal
  'RO': 'eu', // Romania
  'SK': 'eu', // Slovakia
  'SI': 'eu', // Slovenia
  'ES': 'eu', // Spain
  'SE': 'eu', // Sweden
  
  // United Kingdom
  'GB': 'uk', // United Kingdom
  
  // United States
  'US': 'usa', // United States
  
  // Canada
  'CA': 'canada', // Canada
  
  // Australia
  'AU': 'australia', // Australia
  'NZ': 'australia', // New Zealand (often follows Australian standards)
  
  // Japan
  'JP': 'japan', // Japan
  
  // Other European countries (non-EU but often follow EU standards)
  'NO': 'eu', // Norway
  'CH': 'eu', // Switzerland
  'IS': 'eu', // Iceland
  'LI': 'eu', // Liechtenstein
};

/**
 * Get user's current position using the Geolocation API
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

/**
 * Get country code from coordinates using a reverse geocoding service
 */
export async function getCountryFromCoordinates(
  latitude: number, 
  longitude: number
): Promise<string | null> {
  try {
    // Using the free ipapi.co service as fallback for reverse geocoding
    const response = await fetch(
      `https://ipapi.co/json/`,
      {
        timeout: 5000
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.warn('Failed to get country from coordinates:', error);
    return null;
  }
}

/**
 * Get country code from IP address as fallback
 */
export async function getCountryFromIP(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP location data');
    }
    
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.warn('Failed to get country from IP:', error);
    return null;
  }
}

/**
 * Map country code to region
 */
export function getRegionFromCountryCode(countryCode: string): string {
  return COUNTRY_TO_REGION[countryCode.toUpperCase()] || 'global';
}

/**
 * Request geolocation permission and get the appropriate region
 */
export async function getRegionFromGeolocation(): Promise<{
  region: string;
  method: 'geolocation' | 'ip' | 'default';
  country?: string;
}> {
  try {
    // Try precise geolocation first
    const position = await getCurrentPosition();
    
    // Use rough geolocation-based region detection
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    
    // Simple geographical region detection based on coordinates
    const region = getRegionFromCoordinates(lat, lng);
    
    return {
      region,
      method: 'geolocation'
    };
  } catch (geoError) {
    console.info('Geolocation not available or denied:', geoError.message);
  }

  try {
    // Fallback to IP-based location
    const countryFromIP = await getCountryFromIP();
    
    if (countryFromIP) {
      const region = getRegionFromCountryCode(countryFromIP);
      return {
        region,
        method: 'ip',
        country: countryFromIP
      };
    }
  } catch (ipError) {
    console.warn('IP-based location failed:', ipError);
  }
  
  // Default to global if all methods fail
  return {
    region: 'global',
    method: 'default'
  };
}

/**
 * Get region from coordinates using rough geographical boundaries
 */
function getRegionFromCoordinates(lat: number, lng: number): string {
  // Europe (rough boundaries)
  if (lat >= 35 && lat <= 71 && lng >= -10 && lng <= 40) {
    // UK specific
    if (lat >= 50 && lat <= 61 && lng >= -8 && lng <= 2) {
      return 'uk';
    }
    return 'eu';
  }
  
  // North America
  if (lat >= 25 && lat <= 83 && lng >= -168 && lng <= -52) {
    // Canada (rough northern boundary)
    if (lat >= 45) {
      return 'canada';
    }
    // USA
    return 'usa';
  }
  
  // Australia/Oceania
  if (lat >= -50 && lat <= -10 && lng >= 110 && lng <= 180) {
    return 'australia';
  }
  
  // Japan (rough boundaries)
  if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) {
    return 'japan';
  }
  
  // Default to global for other regions
  return 'global';
}

/**
 * Check if geolocation permission is available
 */
export async function checkGeolocationPermission(): Promise<PermissionState | null> {
  try {
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    }
    return null;
  } catch (error) {
    console.warn('Failed to check geolocation permission:', error);
    return null;
  }
}