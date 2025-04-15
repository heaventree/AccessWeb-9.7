# WCAG Accessibility Audit Tool - Documentation Master Index

This document serves as the central navigation point for all WCAG Accessibility Audit Tool documentation, organized by category for easy reference.

## Project Management

- [README.md](./README.md) - Overview of the project management system
- [PLANNING.md](./PLANNING.md) - Project vision, technical architecture, and constraints
- [TASK.md](./TASK.md) - Current tasks, their status, and progress tracking
- [ROADMAP.md](./ROADMAP.md) - Long-term project goals and feature timelines
- [ISSUES.md](./ISSUES.md) - Known issues, bugs, and their resolution status
- [CHANGELOG.md](./CHANGELOG.md) - History of changes to the project
- [AI_AGENT_GUIDELINES.md](./AI_AGENT_GUIDELINES.md) - Guidelines for AI agents working on the project
- [CONSOLIDATION_PLAN.md](./CONSOLIDATION_PLAN.md) - Plan for consolidating documentation
- [project.index.json](./project.index.json) - Machine-readable project structure

## Technical Documentation

### Architecture & System Design

- [technical/architecture/system_architecture.md](./technical/architecture/system_architecture.md) - Overall system architecture
- [technical/architecture/frontend_architecture.md](./technical/architecture/frontend_architecture.md) - React + TypeScript frontend design
- [technical/architecture/component_structure.md](./technical/architecture/component_structure.md) - Component organization and hierarchy

### Development Guidelines

- [technical/guides/development_workflow.md](./technical/guides/development_workflow.md) - Development process and standards
- [technical/guides/accessibility_standards.md](./technical/guides/accessibility_standards.md) - WCAG compliance implementation guide
- [technical/guides/ui_component_system.md](./technical/guides/ui_component_system.md) - UI component design patterns

### Best Practices

- [technical/best_practices/error_handling.md](./technical/best_practices/error_handling.md) - Error handling and debugging standards
- [technical/best_practices/accessibility_testing.md](./technical/best_practices/accessibility_testing.md) - Testing for accessibility compliance
- [technical/best_practices/code_quality.md](./technical/best_practices/code_quality.md) - Code quality and review standards

### Security

- [technical/security/security_guidelines.md](./technical/security/security_guidelines.md) - Security standards and best practices
- [technical/security/data_protection.md](./technical/security/data_protection.md) - User data protection measures

### API Documentation

- [technical/apis/api_reference.md](./technical/apis/api_reference.md) - API documentation
- [technical/apis/api_troubleshooting.md](./technical/apis/api_troubleshooting.md) - Troubleshooting API issues

### Integrations

- [technical/integrations/wordpress_integration.md](./technical/integrations/wordpress_integration.md) - WordPress integration implementation
- [technical/integrations/document_scanners.md](./technical/integrations/document_scanners.md) - PDF and document scanning integration

### Feature Specifications

- [technical/specifications/animated_walkthrough.md](./technical/specifications/animated_walkthrough.md) - WCAG animated walkthrough feature
- [technical/specifications/content_organization.md](./technical/specifications/content_organization.md) - Content organization system

## Project Updates

### Milestone Reports

- [updates/milestones/wordpress_integration_completion.md](./updates/milestones/wordpress_integration_completion.md) - WordPress integration milestone
- [updates/milestones/wcag94_completion_report.md](./updates/milestones/wcag94_completion_report.md) - WCAG 9.4 completion status

### Handover Documentation

- [updates/handovers/feedback_implementation.md](./updates/handovers/feedback_implementation.md) - Feedback system implementation guide
- [updates/handovers/section_identifiers.md](./updates/handovers/section_identifiers.md) - Section identifiers implementation guide

## Structure of Documentation

The documentation is organized in a hierarchical structure:

1. **Project Management** - Core files in the root `project_management` directory for tracking tasks, issues, and project progress
2. **Technical Documentation** - Technical specifications and development guidelines in the `technical` directory
3. **Project Updates** - Milestone reports and handover documentation in the `updates` directory
4. **Archives** - Historical documentation preserved in the `archive` directory

## Documentation Conventions

All documentation follows these conventions:

1. **Markdown Format** - All documentation is written in Markdown for consistency
2. **File Naming** - Uppercase for main index files, lowercase with underscores for specific guides
3. **Headers** - Use H1 (#) for document title, H2 (##) for major sections, H3 (###) for subsections
4. **Links** - Use relative paths for internal links to other documentation files
5. **Tables** - Use Markdown tables for structured data
6. **Code Blocks** - Use triple backticks with language specifier for code examples
7. **Task IDs** - Prefix with WCAG- for project management tasks
8. **Issue IDs** - Prefix with ISSUE- for bug tracking

## How to Update Documentation

When adding or updating documentation:

1. Update the appropriate sectional document
2. Add an entry to CHANGELOG.md if it's a significant change
3. Update this master index if adding new files
4. Verify all links are working
5. Follow the formatting and naming conventions

## Accessibility Standards

As an accessibility tool, our documentation adheres to these standards:

1. **Alt Text** - All images include descriptive alt text
2. **Heading Structure** - Proper heading hierarchy for screen reader navigation
3. **Link Text** - Descriptive link text instead of "click here" or URLs
4. **Color Contrast** - References to color are accompanied by visual indicators
5. **Tables** - Tables include proper headers and row/column relationships