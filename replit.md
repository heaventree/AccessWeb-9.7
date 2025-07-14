# WCAG Accessibility Audit Tool

## Overview

The WCAG Accessibility Audit Tool is a comprehensive platform for testing, monitoring, and improving web accessibility compliance with WCAG 2.2 standards. It provides intelligent analysis, guided remediation, and user-friendly reporting for web accessibility auditing.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Tailwind CSS** for utility-first styling with consistent design tokens
- **Framer Motion** for accessible animations and micro-interactions
- **TanStack React Query** for efficient server state management and caching
- **Zustand** for client-side state management
- **Headless UI** patterns for accessible component implementations

### Backend Architecture
- **Flask** web framework with Jinja2 templating
- **SQLAlchemy ORM** for database interactions and query building
- **RESTful API** design for service communication
- **PostgreSQL** database for structured data storage
- **Multi-tenant architecture** with proper data isolation

### Development Environment
- **Node.js 20** runtime environment
- **Python 3.11** for backend services
- **PostgreSQL 16** database system
- **Multiple workflow configurations** for parallel development

## Key Components

### Core Testing Engine
- Automated WCAG 2.2 compliance analysis
- PDF document accessibility validation
- Color contrast testing utilities
- Focus order validation tools
- Form accessibility testing

### WordPress Integration
- Direct API connectivity with WordPress sites
- Plugin detection and verification system
- Real-time site scanning capabilities
- Intelligent response caching for performance

### Authentication & Security
- JWT-based authentication with secure token rotation
- CSRF protection with token validation
- Rate limiting for API endpoints
- Content Security Policy implementation
- Input sanitization and validation

### User Interface Components
- Compound component architecture
- High contrast mode support
- Reduced motion preferences
- Comprehensive error handling with recovery
- Section identifiers for visual debugging

### Reporting System
- Detailed compliance reports
- Interactive design tools integration
- Customizable export functionality
- Real-time monitoring capabilities

## Data Flow

1. **User Authentication**: Secure login with JWT tokens and session management
2. **Site Analysis**: URL submission triggers comprehensive accessibility scanning
3. **Testing Pipeline**: Automated checks against WCAG 2.2 criteria with intelligent analysis
4. **Data Processing**: Results are processed, categorized, and stored with proper tenant isolation
5. **Report Generation**: Detailed reports with actionable remediation guidance
6. **Continuous Monitoring**: Optional real-time monitoring for ongoing compliance

## External Dependencies

### Core Dependencies
- **React ecosystem**: React, React DOM, React Router for frontend framework
- **UI Libraries**: Headless UI, Heroicons, Radix UI components
- **State Management**: TanStack React Query, Zustand
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT handling, bcrypt for password hashing

### Integration APIs
- **WordPress REST API** for site connectivity and plugin communication
- **PDF Processing** libraries for document accessibility testing
- **Web Scraping** tools for dynamic content analysis

### Development Tools
- **TypeScript** for type safety
- **Vite** for build optimization
- **Testing**: Jest, React Testing Library, Cypress
- **Code Quality**: ESLint, Prettier

## Deployment Strategy

### Development Environment
- **Replit-based development** with configured modules for Node.js, Python, and PostgreSQL
- **Parallel workflow execution** for frontend and backend services
- **Hot reload** capabilities for rapid development iteration

### Production Considerations
- **Multi-tenant architecture** requiring proper data isolation
- **Scalable database design** with connection pooling
- **Security-first approach** with comprehensive authentication and authorization
- **Performance optimization** through caching and efficient query patterns

### Infrastructure Requirements
- PostgreSQL database with proper indexing for large-scale accessibility data
- Web server capable of handling concurrent analysis requests
- Secure environment variable management for API keys and secrets
- CDN integration for static asset delivery

## Changelog

- July 14, 2025: Fixed CSP violations blocking API calls by adding localhost:* to connect-src directive for development
- July 14, 2025: Replaced all hardcoded API URLs with centralized API configuration using environment variables
- July 14, 2025: Created centralized API configuration file (config/api.ts) for consistent endpoint management
- July 14, 2025: Updated authentication service and integration components to use proper API base URLs
- June 17, 2025: WordPress webhook endpoint (`/wcag-compliance/schedule-response`) optimized with async scan processing for fast responses
- June 17, 2025: WordPress Code Change Detection system completed with full API integration
- June 17, 2025: Extended timeout support for WordPress "Run Once" scans (10 minutes)
- June 17, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.