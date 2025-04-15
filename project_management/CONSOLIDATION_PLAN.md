# WCAG Accessibility Audit Tool - Documentation Consolidation Plan

This document outlines the steps to consolidate documentation scattered across the project into the unified `project_management/` directory for the WCAG Accessibility Audit Tool.

## Current Status

Documentation is currently scattered across multiple directories:

1. `project_management/` - New PM system structure (previously used for Payymo):
   - PLANNING.md
   - TASK.md
   - ROADMAP.md
   - ISSUES.md
   - CHANGELOG.md
   - AI_AGENT_GUIDELINES.md
   - MASTER_INDEX.md
   - project.index.json
   - README.md

2. `GUIDES/` - Technical documentation for the WCAG Accessibility Audit Tool:
   - 00_Project_Introduction_Overview.md
   - 01_Technology_Stack.md
   - 02_Directory_File_Structure.md
   - 03_Routing_Navigation.md
   - (and many more files covering technical aspects)

3. `HANDOVERS/` - Project updates and milestone completion reports:
   - 2024-04-12-WordPress-Integration-Enhancement.md
   - 2024-04-14-WordPress-Integration-Enhancement-Completion.md
   - WCAG9.4-COMPLETION-REPORT.md
   - FEEDBACK_IMPLEMENTATION.md
   - (and various other reports and notes)

4. `WCAG9.4-audit/` - Contains project files including some documentation:
   - ROADMAP.md
   - ANIMATED_WALKTHROUGH_SPEC.md
   - CONTENT_REORGANIZATION.md
   - (source code and implementation files)

## Consolidation Plan

### Step 1: Update Project Management Core Files

1. Update the main project management files to reflect the WCAG Accessibility Audit Tool:
   - Replace Payymo references in README.md with WCAG Accessibility Audit Tool information
   - Update MASTER_INDEX.md to create a proper directory structure for our project
   - Update AI_AGENT_GUIDELINES.md with WCAG Accessibility-specific guidelines

### Step 2: Create Technical Documentation Structure

1. Create structured subdirectories in the project_management folder:
   ```
   mkdir -p project_management/technical/architecture
   mkdir -p project_management/technical/best_practices
   mkdir -p project_management/technical/security
   mkdir -p project_management/technical/guides
   mkdir -p project_management/technical/apis
   mkdir -p project_management/technical/integrations
   ```

2. Migrate GUIDES content to the appropriate technical subdirectories:
   - Architecture files to technical/architecture/
   - Development guidelines to technical/guides/
   - Security-related docs to technical/security/
   - WordPress integration docs to technical/integrations/

### Step 3: Consolidate Progress Reports and Updates

1. Create a structured updates section:
   ```
   mkdir -p project_management/updates
   mkdir -p project_management/updates/milestones
   mkdir -p project_management/updates/handovers
   ```

2. Copy and organize HANDOVERS documents:
   - WordPress integration reports to updates/milestones/
   - Feedback implementation guides to updates/handovers/
   - Completion reports to updates/milestones/

### Step 4: Consolidate Roadmap and Planning Documents

1. Merge WCAG9.4-audit/ROADMAP.md into project_management/ROADMAP.md
2. Extract information from ANIMATED_WALKTHROUGH_SPEC.md and CONTENT_REORGANIZATION.md to create feature specifications in project_management/technical/specifications/

### Step 5: Create Archive Folders for Original Documents

1. Create archive folders to preserve the original documentation structure:
   ```
   mkdir -p project_management/archive/guides
   mkdir -p project_management/archive/handovers
   ```

2. Copy original documentation to archive folders:
   ```
   cp -R GUIDES/* project_management/archive/guides/
   cp -R HANDOVERS/* project_management/archive/handovers/
   ```

### Step 6: Update Master Index and Create Directory Structure Document

1. Thoroughly update MASTER_INDEX.md to reflect the new structure and include links to all documentation
2. Create a DIRECTORY_STRUCTURE.md document explaining the organization of the project management system
3. Update the project.index.json file to match the new structure for machine-readable access

## Implementation Approach

For each document being migrated:

1. **Read Original Content**: Fully understand the original document content
2. **Extract Relevant Information**: Identify key information related to the WCAG Accessibility Audit Tool
3. **Transform Format**: Restructure content to match the new documentation format
4. **Remove Unrelated Content**: Delete information specific to other projects (like Payymo)
5. **Add Cross-References**: Add links to related documents in the new structure
6. **Update Metadata**: Ensure dates, version numbers, and status information are current
7. **Verify Technical Accuracy**: Ensure all technical details match the actual implementation

## Post-Consolidation Steps

1. Perform a comprehensive review of all documentation for consistency
2. Create a changelog entry documenting the consolidation process
3. Update the README.md in all original documentation locations with pointers to the new documentation
4. Add a task to TASK.md to review and validate the consolidated documentation

## Documentation Standards

All consolidated documentation will follow these standards:

1. **Markdown Format**: All documentation in Markdown with consistent formatting
2. **Clear Headings**: Proper heading hierarchy (H1 for title, H2 for sections, etc.)
3. **File Naming**: Uppercase for main index files, lowercase with underscores for specific guides
4. **Cross-Referencing**: Consistent use of relative links between documents
5. **Dated Updates**: All milestone and update documents include clear dates
6. **Version Tracking**: References to software versions are specific and accurate
7. **Task IDs**: Integration with task tracking using consistent ID formats