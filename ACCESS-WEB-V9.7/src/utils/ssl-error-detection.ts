/**
 * SSL/TLS Error Detection Utility
 * Provides detailed analysis of SSL/TLS connection issues
 */

/**
 * Types of SSL/TLS errors that might occur
 */
export enum SSLErrorType {
  EXPIRED_CERTIFICATE = 'expired_certificate',
  SELF_SIGNED_CERTIFICATE = 'self_signed_certificate',
  UNTRUSTED_ROOT = 'untrusted_root',
  HOSTNAME_MISMATCH = 'hostname_mismatch',
  PROTOCOL_VERSION = 'protocol_version',
  CIPHER_SUITE_MISMATCH = 'cipher_suite_mismatch',
  HANDSHAKE_TIMEOUT = 'handshake_timeout',
  REVOKED_CERTIFICATE = 'revoked_certificate',
  UNKNOWN = 'unknown'
}

/**
 * Structure for SSL error details
 */
export interface SSLErrorDetails {
  type: SSLErrorType;
  message: string;
  technicalDetails: string;
  userFriendlyMessage: string;
  possibleSolutions: string[];
  severityLevel: 'critical' | 'high' | 'medium' | 'low';
  requiresExpertise: boolean;
  learnMoreUrl?: string;
}

/**
 * Map of common SSL error messages to their specific error types
 */
const SSL_ERROR_PATTERNS: Record<string, SSLErrorType> = {
  'certificate has expired': SSLErrorType.EXPIRED_CERTIFICATE,
  'certificate is not yet valid': SSLErrorType.EXPIRED_CERTIFICATE,
  'self signed certificate': SSLErrorType.SELF_SIGNED_CERTIFICATE,
  'self-signed certificate': SSLErrorType.SELF_SIGNED_CERTIFICATE,
  'unable to verify the first certificate': SSLErrorType.UNTRUSTED_ROOT,
  'unable to get local issuer certificate': SSLErrorType.UNTRUSTED_ROOT,
  'certificate is not trusted': SSLErrorType.UNTRUSTED_ROOT,
  'hostname/ip doesn\'t match': SSLErrorType.HOSTNAME_MISMATCH,
  'certificate name mismatch': SSLErrorType.HOSTNAME_MISMATCH,
  'handshake failure': SSLErrorType.PROTOCOL_VERSION,
  'protocol version': SSLErrorType.PROTOCOL_VERSION,
  'handshake timeout': SSLErrorType.HANDSHAKE_TIMEOUT,
  'certificate has been revoked': SSLErrorType.REVOKED_CERTIFICATE,
  'tlsv1 alert protocol version': SSLErrorType.PROTOCOL_VERSION,
  'cipher suite': SSLErrorType.CIPHER_SUITE_MISMATCH,
  'no cipher match': SSLErrorType.CIPHER_SUITE_MISMATCH
};

/**
 * Detailed information for each SSL error type
 */
export const SSL_ERROR_DETAILS: Record<SSLErrorType, Omit<SSLErrorDetails, 'technicalDetails'>> = {
  [SSLErrorType.EXPIRED_CERTIFICATE]: {
    type: SSLErrorType.EXPIRED_CERTIFICATE,
    message: 'SSL Certificate Expired',
    userFriendlyMessage: 'This website has an expired SSL certificate.',
    possibleSolutions: [
      'The website\'s SSL certificate has expired and needs to be renewed',
      'Check if your system date and time are correct',
      'Contact the website administrator to renew their SSL certificate'
    ],
    severityLevel: 'high',
    requiresExpertise: false,
    learnMoreUrl: 'https://www.digicert.com/blog/what-happens-when-your-ssl-certificate-expires'
  },
  [SSLErrorType.SELF_SIGNED_CERTIFICATE]: {
    type: SSLErrorType.SELF_SIGNED_CERTIFICATE,
    message: 'Self-Signed Certificate',
    userFriendlyMessage: 'This website is using a self-signed certificate, which is not trusted by browsers.',
    possibleSolutions: [
      'The website should obtain a certificate from a trusted certificate authority',
      'Contact the website administrator to replace their self-signed certificate',
      'This may be intentional for internal or development websites'
    ],
    severityLevel: 'high',
    requiresExpertise: true,
    learnMoreUrl: 'https://www.globalsign.com/en/blog/self-signed-certificate-vs-trusted-ca-signed'
  },
  [SSLErrorType.UNTRUSTED_ROOT]: {
    type: SSLErrorType.UNTRUSTED_ROOT,
    message: 'Untrusted Certificate Authority',
    userFriendlyMessage: 'This website\'s security certificate is issued by an untrusted authority.',
    possibleSolutions: [
      'The website is using a certificate from an untrusted certificate authority',
      'Contact the website administrator to get a certificate from a trusted CA',
      'Some organizations use their own certificate authorities for internal sites'
    ],
    severityLevel: 'high',
    requiresExpertise: true,
    learnMoreUrl: 'https://www.ssl.com/article/what-is-a-certificate-authority/'
  },
  [SSLErrorType.HOSTNAME_MISMATCH]: {
    type: SSLErrorType.HOSTNAME_MISMATCH,
    message: 'Certificate Hostname Mismatch',
    userFriendlyMessage: 'The security certificate is valid but not issued for this domain name.',
    possibleSolutions: [
      'The website might be using a certificate meant for a different domain',
      'The website might be misconfigured, using the wrong certificate',
      'Contact the website administrator to correct their SSL configuration'
    ],
    severityLevel: 'high',
    requiresExpertise: true,
    learnMoreUrl: 'https://www.ssl.com/faqs/what-is-a-common-name-mismatch-error/'
  },
  [SSLErrorType.PROTOCOL_VERSION]: {
    type: SSLErrorType.PROTOCOL_VERSION,
    message: 'SSL/TLS Protocol Version Mismatch',
    userFriendlyMessage: 'There is a mismatch in the secure connection protocol versions.',
    possibleSolutions: [
      'The website might be using an outdated or unsupported TLS version',
      'The server might need to enable support for modern TLS versions',
      'Contact the website administrator to update their TLS configuration'
    ],
    severityLevel: 'medium',
    requiresExpertise: true,
    learnMoreUrl: 'https://www.ssl.com/guide/ssl-and-tls-protocol-versions-explained/'
  },
  [SSLErrorType.CIPHER_SUITE_MISMATCH]: {
    type: SSLErrorType.CIPHER_SUITE_MISMATCH,
    message: 'Cipher Suite Mismatch',
    userFriendlyMessage: 'The encryption methods used by this website are incompatible.',
    possibleSolutions: [
      'The website is using encryption methods that aren\'t supported',
      'The server might be using only very old or very new cipher suites',
      'Contact the website administrator to update their cipher configuration'
    ],
    severityLevel: 'medium',
    requiresExpertise: true,
    learnMoreUrl: 'https://www.ssl.com/article/ssl-best-practices-for-security/'
  },
  [SSLErrorType.HANDSHAKE_TIMEOUT]: {
    type: SSLErrorType.HANDSHAKE_TIMEOUT,
    message: 'SSL/TLS Handshake Timeout',
    userFriendlyMessage: 'The secure connection process timed out.',
    possibleSolutions: [
      'The website server might be overloaded or responding slowly',
      'There might be network issues between you and the server',
      'The website might have SSL/TLS configuration issues causing delays',
      'Try again later when the server may be more responsive'
    ],
    severityLevel: 'medium',
    requiresExpertise: false,
    learnMoreUrl: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/'
  },
  [SSLErrorType.REVOKED_CERTIFICATE]: {
    type: SSLErrorType.REVOKED_CERTIFICATE,
    message: 'Certificate Revoked',
    userFriendlyMessage: 'This website\'s security certificate has been revoked.',
    possibleSolutions: [
      'The website\'s certificate was revoked, possibly due to a security issue',
      'Contact the website administrator to obtain a new, valid certificate',
      'This could indicate a serious security concern with the website'
    ],
    severityLevel: 'critical',
    requiresExpertise: false,
    learnMoreUrl: 'https://www.ssl.com/blogs/how-do-i-revoke-my-ssl-tls-certificate/'
  },
  [SSLErrorType.UNKNOWN]: {
    type: SSLErrorType.UNKNOWN,
    message: 'Unknown SSL/TLS Error',
    userFriendlyMessage: 'There is an unidentified issue with this website\'s secure connection.',
    possibleSolutions: [
      'The website has a security configuration issue',
      'Try visiting the website directly in your browser to see more details',
      'Contact the website administrator to investigate their SSL/TLS setup'
    ],
    severityLevel: 'medium',
    requiresExpertise: true,
    learnMoreUrl: 'https://www.digicert.com/blog/not-secure-warning-what-to-do'
  }
};

/**
 * Analyze an SSL error message to determine the specific type of SSL/TLS issue
 * 
 * @param errorMessage The error message to analyze
 * @returns The specific SSL error type and detailed information
 */
export function analyzeSSLError(errorMessage: string): SSLErrorDetails {
  const normalizedError = errorMessage.toLowerCase();
  
  // Match the error message against known patterns
  let errorType = SSLErrorType.UNKNOWN;
  
  for (const [pattern, type] of Object.entries(SSL_ERROR_PATTERNS)) {
    if (normalizedError.includes(pattern.toLowerCase())) {
      errorType = type;
      break;
    }
  }
  
  // Get the details for this error type
  const details = SSL_ERROR_DETAILS[errorType];
  
  return {
    ...details,
    technicalDetails: errorMessage
  };
}

/**
 * Get an informative message about SSL verification options for users
 * 
 * @param errorType The type of SSL error detected
 * @returns A message about verification options
 */
export function getSSLVerificationMessage(errorType: SSLErrorType): string {
  switch (errorType) {
    case SSLErrorType.EXPIRED_CERTIFICATE:
      return 'Browsers will warn you about expired certificates. You might be able to proceed, but it\'s not recommended.';
    case SSLErrorType.SELF_SIGNED_CERTIFICATE:
      return 'Self-signed certificates can be legitimate for internal sites, but are not trusted by default.';
    case SSLErrorType.UNTRUSTED_ROOT:
      return 'Untrusted certificate authorities pose a potential security risk. Proceed with caution.';
    case SSLErrorType.HOSTNAME_MISMATCH:
      return 'A hostname mismatch might indicate an improperly configured site or a potential security issue.';
    case SSLErrorType.REVOKED_CERTIFICATE:
      return 'A revoked certificate is a serious security concern. Avoid proceeding to this website.';
    default:
      return 'When visiting a website with SSL/TLS issues, your browser will show security warnings.';
  }
}