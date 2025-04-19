# Component Mapping Document
**Project:** ACCESS-WEB-V9.7
**Date:** April 19, 2025
**Status:** Draft

## Purpose
This document maps out all components in the ACCESS-WEB-V9.7 project, their purposes, dependencies, and relationships to support the project unification process.

## Component Categories

### 1. Accessibility Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `accessibility/AccessibilityControls` | Provides user controls for accessibility settings | ui components, accessibilityTester.ts | ✅ Active |
| `accessibility/AccessibilityScanner` | Core scanner tool for web content | apiClient.ts, htmlStructureAnalyzer.ts | ✅ Active |
| `accessibility/AccessibilityScoreCard` | Displays accessibility scores and metrics | analytics components, charts | ✅ Active |
| `accessibility/IssueReporter` | Reports accessibility issues found | apiClient.ts, errorHandler.ts | ✅ Active |
| `accessibility/RemediationSuggestions` | Suggests fixes for issues | aiRecommendations.ts | ✅ Active |
| `WCAGToolbar/WCAGToolbar` | Main accessibility toolbar component | Multiple accessibility components | ✅ Active |

### 2. Administration Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `admin/Dashboard` | Admin dashboard overview | analytics, auth, ui components | ✅ Active |
| `admin/UserManagement` | User administration and roles | auth.ts, apiClient.ts | ✅ Active |
| `admin/SystemSettings` | System-wide configuration | settings components | ✅ Active |
| `admin/AuditLogs` | View system audit logs | securityHeaders.ts, apiClient.ts | ✅ Active |

### 3. Authentication Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `auth/Login` | User login form | auth.ts, validation.ts | ✅ Active |
| `auth/Register` | User registration | auth.ts, validation.ts | ✅ Active |
| `auth/PasswordReset` | Password reset workflow | auth.ts, password.ts | ✅ Active |
| `auth/MFA` | Multi-factor authentication | auth.ts, security.ts | ✅ Active |
| `auth/EmailVerification` | Email verification process | auth.ts, apiClient.ts | ✅ Active |

### 4. UI Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `ui/Button` | Button component | None | ✅ Active |
| `ui/Card` | Card container | None | ✅ Active |
| `ui/Modal` | Modal dialog | None | ✅ Active |
| `ui/Form` | Form components | validation.ts | ✅ Active |
| `ui/Table` | Table component | None | ✅ Active |
| `ui/Tabs` | Tab navigation | None | ✅ Active |
| `ui/Toast` | Toast notifications | None | ✅ Active |

### 5. Analytics Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `analytics/Dashboard` | Analytics dashboard | charts, apiClient.ts | ✅ Active |
| `analytics/Reports` | Reporting tools | apiClient.ts, export utilities | ✅ Active |
| `analytics/Metrics` | Metrics visualization | charts | ✅ Active |
| `analytics/UserBehavior` | User behavior tracking | apiClient.ts | ✅ Active |

### 6. Payment Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `payment/Checkout` | Payment checkout flow | stripe.ts, validation.ts | ✅ Active |
| `payment/SubscriptionManager` | Manage subscriptions | stripe.ts, apiClient.ts | ✅ Active |
| `payment/InvoiceHistory` | View invoice history | apiClient.ts | ✅ Active |
| `payment/PaymentMethods` | Manage payment methods | stripe.ts | ✅ Active |

### 7. Feedback Components
| Component | Purpose | Dependencies | Status |
|-----------|---------|--------------|--------|
| `feedback/FeedbackForm` | User feedback collection | apiClient.ts, validation.ts | ✅ Active |
| `feedback/SurveyTool` | User surveys | apiClient.ts | ✅ Active |
| `feedback/RatingSystem` | Rating collection | apiClient.ts | ✅ Active |
| `feedback/utils/FeedbackAnalyzer` | Analyze feedback data | analytics components | ✅ Active |

### 8. Utility Functions
| Utility | Purpose | Dependencies | Status |
|---------|---------|--------------|--------|
| `accessibility-compliance.ts` | WCAG compliance definitions | None | ✅ Active |
| `accessibilityTester.ts` | Accessibility testing functions | errorHandler.ts | ✅ Active |
| `aiRecommendations.ts` | AI-based recommendations | apiClient.ts | ✅ Active |
| `apiClient.ts` | API communication | errorHandler.ts | ✅ Active |
| `auth.ts` | Authentication utilities | secureStorage.ts, password.ts | ✅ Active |
| `colorContrastChecker.ts` | Check color contrast | None | ✅ Active |
| `contentSecurity.ts` | Content Security Policy | environment.ts | ✅ Active |
| `csrfProtection.ts` | CSRF protection | secureStorage.ts | ✅ Active |
| `errorHandler.ts` | Error handling | None | ✅ Active |
| `htmlStructureAnalyzer.ts` | Analyze HTML structure | None | ✅ Active |
| `secureStorage.ts` | Secure client-side storage | crypto.ts | ✅ Active |
| `securityHeaders.ts` | Security headers | environment.ts | ✅ Active |
| `validation.ts` | Input validation | None | ✅ Active |
| `wcagHelper.ts` | WCAG helper functions | accessibility-compliance.ts | ✅ Active |

## Component Relationships

### Key Relationships
1. **Authentication Flow**:
   - `auth/Login` → `auth.ts` → `secureStorage.ts` → Application access
   
2. **Accessibility Testing Flow**:
   - `WCAGToolbar/WCAGToolbar` → `accessibility/AccessibilityScanner` → `accessibilityTester.ts` → `htmlStructureAnalyzer.ts` → Results display

3. **Payment Processing Flow**:
   - `payment/Checkout` → `stripe.ts` → Payment gateway → `payment/InvoiceHistory`

4. **Admin Management Flow**:
   - `admin/Dashboard` → `admin/UserManagement` → `auth.ts` → User data management

5. **Feedback Collection Flow**:
   - `feedback/FeedbackForm` → `apiClient.ts` → Database → `feedback/utils/FeedbackAnalyzer` → `analytics/Reports`

## Duplication Assessment

Based on file comparisons between ACCESS-WEB-V9.7 and WCAG9.4-audit:

1. **Identical Components**: Most components appear to be identical with minor version differences
2. **Unique Components**: The WCAGToolbar component is unique to ACCESS-WEB-V9.7
3. **Utility Functions**: Most utility functions appear identical between repositories
4. **Configuration Files**: Configuration differences exist (different versions, dependencies)

## Consolidation Approach

### Primary Component Sources
- Use ACCESS-WEB-V9.7 as the primary source for all components
- Conduct detailed diffs for any significant files to ensure no loss of functionality
- Preserve the WCAGToolbar component from ACCESS-WEB-V9.7
- Merge any unique functionality from WCAG9.4-audit if found during detailed comparison

### Component Structure Standardization
- Ensure consistent naming conventions (PascalCase for components)
- Standardize component folder structure (component/index.tsx + component/styles.ts pattern)
- Ensure proper documentation for each component
- Implement proper type definitions for all component props

## Next Steps

1. Conduct detailed file-by-file comparison for critical components
2. Identify any version differences that may impact functionality
3. Create standardized component templates for future development
4. Update the import paths across all files to match the new structure