# Security Utilities

This module provides utilities for security features, protection mechanisms, and other security-related operations.

## Available Utilities

- **contentSecurity**: Content Security Policy implementation and helpers
- **crypto**: Cryptographic functions for encryption, decryption, and hashing
- **csrfProtection**: Cross-Site Request Forgery protection mechanisms
- **rateLimiting**: Rate limiting functions to prevent abuse
- **sanitization**: Input and output sanitization utilities
- **security**: General security utilities
- **securityHeaders**: HTTP security headers implementation
- **validation**: Input validation utilities

## Usage Examples

```typescript
// Import specific utility
import { sanitizeHtml } from '@/utils/security';

// Use utility
const safeHtml = sanitizeHtml('<script>alert("XSS")</script>Hello');
```

For more detailed documentation, see each individual utility file.