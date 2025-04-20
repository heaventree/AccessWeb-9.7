# LSP Issues to Revisit

This document lists all Language Server Protocol (LSP) issues that need to be addressed in a future cleanup pass.

## Import Path Issues

### Services Directory
- **services/api.ts**
  - Lines 61, 94, 128, 160: Argument of type 'unknown' is not assignable to parameter of type 'string | Error'.

- **services/authApi.ts**
  - Line 9: Cannot find module '../utils/security/passwordPolicy' or its corresponding type declarations.

### Utils Directory
- **utils/api/apiClient.ts**
  - Lines 325-329: Expected 1-3 arguments, but got 4.

- **utils/security/csrfProtection.ts**
  - Line 104: Type signature mismatch 
  - Line 106: Argument type mismatch in source vs target

- **utils/security/rateLimiting.ts**
  - Line 314: Expected 1-3 arguments, but got 4.

- **utils/common/secureStorage.ts**
  - Line 8: Cannot find module './crypto' or its corresponding type declarations.

- **utils/index.ts**
  - Line 17: Multiple modules have exported members with the same name (ambiguity with secureStorage functions)

## Resolution Strategies

1. **Import Path Fixes**:
   - Update imports to use the new directory structure
   - Use index.ts files for easier imports

2. **Function Signature Fixes**:
   - Update function calls to match the expected parameters
   - Fix error handling in API clients

3. **Module Ambiguity Fixes**:
   - Resolve naming conflicts in exported modules
   - Consider namespaced exports for better organization