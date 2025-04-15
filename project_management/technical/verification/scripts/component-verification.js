/**
 * Component Verification Script
 * 
 * This script automates the verification of components against their documentation.
 * It scans the codebase for implemented components, checks for corresponding documentation,
 * and generates a verification report.
 * 
 * Usage:
 * node component-verification.js
 * 
 * Output:
 * - verification-report.json: JSON report of verification results
 * - verification-report.md: Markdown report of verification results
 * - component-inventory-updates.json: Suggested updates to the Component Inventory
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const tsCompiler = require('typescript');

// Configuration
const config = {
  sourcePath: 'WCAG9.4-audit/src',
  documentationPath: 'project_management/technical',
  inventoryPath: 'project_management/technical/verification/component-inventory.md',
  outputPath: 'project_management/technical/verification/reports',
  componentCategories: [
    { prefix: 'UI', path: 'components/common', pattern: '**/*.{tsx,jsx}' },
    { prefix: 'DATA', path: 'components/data', pattern: '**/*.{tsx,jsx}' },
    { prefix: 'SVC', path: 'services', pattern: '**/*.{ts,js}' },
    { prefix: 'UTIL', path: 'utils', pattern: '**/*.{ts,js}' },
    { prefix: 'PAGE', path: 'pages', pattern: '**/*.{tsx,jsx}' },
    { prefix: 'AUTH', path: 'components/auth', pattern: '**/*.{tsx,jsx}' },
    { prefix: 'A11Y', path: 'components/accessibility', pattern: '**/*.{tsx,jsx}' },
    { prefix: 'INT', path: 'integrations', pattern: '**/*.{ts,js}' },
  ]
};

// Ensure output directory exists
if (!fs.existsSync(config.outputPath)) {
  fs.mkdirSync(config.outputPath, { recursive: true });
}

/**
 * Parse the Component Inventory markdown file to extract component information
 * @returns {Array} Array of component objects
 */
function parseComponentInventory() {
  try {
    const inventoryContent = fs.readFileSync(config.inventoryPath, 'utf8');
    const components = [];
    
    // Extract component tables using regex
    const tableRegex = /### ([^\n]+)\n\n\| Component ID \| Component Name \| Description \| Status \| Implementation Location \| Documentation Location \| Last Verified \|\n\|[-\|]+\n((?:\|[^\n]+\n)+)/g;
    let match;
    
    while ((match = tableRegex.exec(inventoryContent)) !== null) {
      const category = match[1];
      const tableContent = match[2];
      
      // Extract rows
      const rowRegex = /\| ([^ |]+) \| ([^ |]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|\n/g;
      let rowMatch;
      
      while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
        components.push({
          id: rowMatch[1].trim(),
          name: rowMatch[2].trim(),
          description: rowMatch[3].trim(),
          status: rowMatch[4].trim(),
          implementationLocation: rowMatch[5].trim(),
          documentationLocation: rowMatch[6].trim(),
          lastVerified: rowMatch[7].trim(),
          category: category
        });
      }
    }
    
    return components;
  } catch (error) {
    console.error('Error parsing Component Inventory:', error);
    return [];
  }
}

/**
 * Scan the codebase for implemented components
 * @returns {Array} Array of implemented component objects
 */
function scanImplementedComponents() {
  const implementedComponents = [];
  
  for (const category of config.componentCategories) {
    const categoryPath = path.join(config.sourcePath, category.path);
    const files = glob.sync(path.join(categoryPath, category.pattern));
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file, path.extname(file));
        const relativePath = path.relative(config.sourcePath, file);
        
        // Parse the file to extract component information
        const componentInfo = {
          name: fileName,
          implementationLocation: path.join('WCAG9.4-audit/src', relativePath),
          category: category.prefix,
          description: extractComponentDescription(content),
          props: extractComponentProps(content),
          exported: isComponentExported(content)
        };
        
        if (componentInfo.exported) {
          implementedComponents.push(componentInfo);
        }
      } catch (error) {
        console.error(`Error scanning file ${file}:`, error);
      }
    }
  }
  
  return implementedComponents;
}

/**
 * Extract component description from JSDoc or TSDoc comments
 * @param {string} content - File content
 * @returns {string} Component description
 */
function extractComponentDescription(content) {
  const jsDocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
  let match;
  let description = '';
  
  while ((match = jsDocRegex.exec(content)) !== null) {
    const docComment = match[1];
    // Remove * at the start of lines and trim
    const cleanedComment = docComment
      .split('\n')
      .map(line => line.replace(/^\s*\*\s*/, '').trim())
      .filter(line => !line.startsWith('@')) // Remove lines with tags like @param
      .join(' ')
      .trim();
    
    if (cleanedComment && !description) {
      description = cleanedComment;
    }
  }
  
  return description;
}

/**
 * Extract component props from TypeScript interface or PropTypes
 * @param {string} content - File content
 * @returns {Array} Array of prop objects
 */
function extractComponentProps(content) {
  const props = [];
  
  try {
    // Parse the content
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    
    // Traverse the AST to find interfaces
    traverse(ast, {
      TSInterfaceDeclaration(path) {
        const interfaceName = path.node.id.name;
        if (interfaceName.includes('Props')) {
          path.node.body.body.forEach(property => {
            if (property.type === 'TSPropertySignature') {
              const propName = property.key.name;
              const required = !property.optional;
              let type = '';
              let description = '';
              
              // Extract type
              if (property.typeAnnotation) {
                type = content.slice(
                  property.typeAnnotation.start,
                  property.typeAnnotation.end
                ).replace(/^:\s*/, '');
              }
              
              // Extract description from JSDoc comment
              const propComment = findLeadingComment(path.hub.file.code, property.start);
              if (propComment) {
                description = propComment
                  .replace(/\/\*\*|\*\//g, '')
                  .replace(/\n\s*\*/g, ' ')
                  .trim();
              }
              
              props.push({
                name: propName,
                type,
                required,
                description
              });
            }
          });
        }
      }
    });
  } catch (error) {
    // Ignore parsing errors
  }
  
  return props;
}

/**
 * Find the JSDoc comment leading a property
 * @param {string} code - Source code
 * @param {number} position - Start position of the property
 * @returns {string|null} JSDoc comment or null
 */
function findLeadingComment(code, position) {
  // Look for JSDoc comment before the property
  const beforeProperty = code.substring(0, position).trim();
  const commentRegex = /\/\*\*[\s\S]*?\*\/$/;
  const match = beforeProperty.match(commentRegex);
  return match ? match[0] : null;
}

/**
 * Check if the component is exported
 * @param {string} content - File content
 * @returns {boolean} Whether the component is exported
 */
function isComponentExported(content) {
  return content.includes('export ') || content.includes('export default ');
}

/**
 * Scan the documentation for documented components
 * @returns {Array} Array of documented component objects
 */
function scanDocumentedComponents() {
  const documentedComponents = [];
  const documentationFiles = glob.sync(path.join(config.documentationPath, '**/*.md'));
  
  for (const file of documentationFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(config.documentationPath, file);
      const documentationLocation = path.join('project_management/technical', relativePath);
      
      // Extract component names using heading patterns
      const headingRegex = /^# ([A-Za-z0-9]+)$/gm;
      let match;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const componentName = match[1];
        const componentContent = content.substring(match.index);
        
        documentedComponents.push({
          name: componentName,
          documentationLocation,
          description: extractDescriptionFromDoc(componentContent),
          props: extractPropsFromDoc(componentContent)
        });
      }
    } catch (error) {
      console.error(`Error scanning documentation file ${file}:`, error);
    }
  }
  
  return documentedComponents;
}

/**
 * Extract component description from markdown documentation
 * @param {string} content - Documentation content
 * @returns {string} Component description
 */
function extractDescriptionFromDoc(content) {
  const overviewRegex = /## Overview\s+([^#]+)/m;
  const match = content.match(overviewRegex);
  return match ? match[1].trim() : '';
}

/**
 * Extract component props from markdown documentation
 * @param {string} content - Documentation content
 * @returns {Array} Array of prop objects
 */
function extractPropsFromDoc(content) {
  const props = [];
  const propsRegex = /## Props.*?\n\| Name \| Type \| Default \| Description \|\n\|[^\n]+\n((?:\|[^\n]+\n)+)/m;
  const match = content.match(propsRegex);
  
  if (match) {
    const propTable = match[1];
    const propRowRegex = /\| ([^ |]+) \| ([^ |]+) \| ([^|]+) \| ([^|]+) \|\n/g;
    let propMatch;
    
    while ((propMatch = propRowRegex.exec(propTable)) !== null) {
      props.push({
        name: propMatch[1].trim(),
        type: propMatch[2].trim(),
        default: propMatch[3].trim(),
        description: propMatch[4].trim(),
        required: propMatch[3].trim() === 'required'
      });
    }
  }
  
  return props;
}

/**
 * Verify components against their documentation
 * @param {Array} inventoryComponents - Components from the inventory
 * @param {Array} implementedComponents - Implemented components
 * @param {Array} documentedComponents - Documented components
 * @returns {Object} Verification results
 */
function verifyComponents(inventoryComponents, implementedComponents, documentedComponents) {
  const results = {
    verified: [],
    documentationGaps: [],
    implementationGaps: [],
    alignmentGaps: [],
    inventoryUpdates: []
  };
  
  // Map for easier lookup
  const implementedMap = implementedComponents.reduce((map, component) => {
    map[component.name] = component;
    return map;
  }, {});
  
  const documentedMap = documentedComponents.reduce((map, component) => {
    map[component.name] = component;
    return map;
  }, {});
  
  // Verify inventory components
  for (const component of inventoryComponents) {
    const implemented = implementedMap[component.name];
    const documented = documentedMap[component.name];
    
    if (implemented && documented) {
      // Verify alignment
      const alignmentIssues = verifyAlignment(component, implemented, documented);
      
      if (alignmentIssues.length === 0) {
        results.verified.push({
          id: component.id,
          name: component.name,
          status: 'Verified',
          lastVerified: new Date().toISOString().split('T')[0]
        });
      } else {
        results.alignmentGaps.push({
          id: component.id,
          name: component.name,
          issues: alignmentIssues,
          lastVerified: new Date().toISOString().split('T')[0]
        });
      }
    } else if (implemented && !documented) {
      // Documentation gap
      results.documentationGaps.push({
        id: component.id,
        name: component.name,
        status: 'Documentation Gap',
        implemented: implemented,
        lastVerified: new Date().toISOString().split('T')[0]
      });
    } else if (!implemented && documented) {
      // Implementation gap
      results.implementationGaps.push({
        id: component.id,
        name: component.name,
        status: 'Implementation Gap',
        documented: documented,
        lastVerified: new Date().toISOString().split('T')[0]
      });
    } else {
      // Both missing - shouldn't happen for inventory components
      results.inventoryUpdates.push({
        id: component.id,
        name: component.name,
        action: 'Remove',
        reason: 'Component not found in implementation or documentation'
      });
    }
  }
  
  // Check for components in implementation but not in inventory
  for (const component of implementedComponents) {
    const inInventory = inventoryComponents.some(c => c.name === component.name);
    
    if (!inInventory) {
      results.inventoryUpdates.push({
        name: component.name,
        action: 'Add',
        category: component.category,
        status: documentedMap[component.name] ? 'Implemented' : 'Implemented Only',
        implementationLocation: component.implementationLocation,
        documentationLocation: documentedMap[component.name] 
          ? documentedMap[component.name].documentationLocation 
          : 'Missing Documentation',
        lastVerified: new Date().toISOString().split('T')[0],
        description: component.description || 'No description available'
      });
    }
  }
  
  // Check for components in documentation but not in inventory
  for (const component of documentedComponents) {
    const inInventory = inventoryComponents.some(c => c.name === component.name);
    const inImplementation = implementedComponents.some(c => c.name === component.name);
    
    if (!inInventory && !inImplementation) {
      results.inventoryUpdates.push({
        name: component.name,
        action: 'Add',
        category: 'Unknown',
        status: 'Documented Only',
        implementationLocation: 'Not Implemented',
        documentationLocation: component.documentationLocation,
        lastVerified: new Date().toISOString().split('T')[0],
        description: component.description || 'No description available'
      });
    }
  }
  
  return results;
}

/**
 * Verify alignment between implementation and documentation
 * @param {Object} inventory - Component from inventory
 * @param {Object} implemented - Implemented component
 * @param {Object} documented - Documented component
 * @returns {Array} Alignment issues
 */
function verifyAlignment(inventory, implemented, documented) {
  const issues = [];
  
  // Compare descriptions
  if (implemented.description && documented.description) {
    const implDescLower = implemented.description.toLowerCase();
    const docDescLower = documented.description.toLowerCase();
    
    if (!implDescLower.includes(docDescLower.substring(0, 20)) && 
        !docDescLower.includes(implDescLower.substring(0, 20))) {
      issues.push({
        type: 'Description Mismatch',
        severity: 'Minor',
        implementedDescription: implemented.description,
        documentedDescription: documented.description
      });
    }
  }
  
  // Compare props
  const implementedProps = implemented.props || [];
  const documentedProps = documented.props || [];
  
  // Check for props in implementation but not in documentation
  for (const implProp of implementedProps) {
    const docProp = documentedProps.find(p => p.name === implProp.name);
    
    if (!docProp) {
      issues.push({
        type: 'Missing Documented Prop',
        severity: 'Major',
        prop: implProp.name,
        details: `Prop ${implProp.name} is implemented but not documented`
      });
    }
  }
  
  // Check for props in documentation but not in implementation
  for (const docProp of documentedProps) {
    const implProp = implementedProps.find(p => p.name === docProp.name);
    
    if (!implProp) {
      issues.push({
        type: 'Missing Implemented Prop',
        severity: 'Major',
        prop: docProp.name,
        details: `Prop ${docProp.name} is documented but not implemented`
      });
    }
  }
  
  return issues;
}

/**
 * Generate verification reports
 * @param {Object} results - Verification results
 */
function generateReports(results) {
  // JSON report
  fs.writeFileSync(
    path.join(config.outputPath, 'verification-report.json'),
    JSON.stringify(results, null, 2)
  );
  
  // Markdown report
  const markdownReport = generateMarkdownReport(results);
  fs.writeFileSync(
    path.join(config.outputPath, 'verification-report.md'),
    markdownReport
  );
  
  // Inventory updates
  fs.writeFileSync(
    path.join(config.outputPath, 'component-inventory-updates.json'),
    JSON.stringify(results.inventoryUpdates, null, 2)
  );
  
  console.log('Verification reports generated:');
  console.log(`- ${path.join(config.outputPath, 'verification-report.json')}`);
  console.log(`- ${path.join(config.outputPath, 'verification-report.md')}`);
  console.log(`- ${path.join(config.outputPath, 'component-inventory-updates.json')}`);
}

/**
 * Generate markdown verification report
 * @param {Object} results - Verification results
 * @returns {string} Markdown report
 */
function generateMarkdownReport(results) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  let markdown = `# Component Verification Report\n\n`;
  markdown += `**Date:** ${timestamp}\n`;
  markdown += `**Status:** Automated Verification\n\n`;
  
  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- **Total Components Verified:** ${results.verified.length + results.alignmentGaps.length + results.documentationGaps.length + results.implementationGaps.length}\n`;
  markdown += `- **Verified Components:** ${results.verified.length}\n`;
  markdown += `- **Alignment Gaps:** ${results.alignmentGaps.length}\n`;
  markdown += `- **Documentation Gaps:** ${results.documentationGaps.length}\n`;
  markdown += `- **Implementation Gaps:** ${results.implementationGaps.length}\n`;
  markdown += `- **Inventory Updates Needed:** ${results.inventoryUpdates.length}\n\n`;
  
  // Verified Components
  markdown += `## Verified Components\n\n`;
  if (results.verified.length === 0) {
    markdown += `No components were fully verified.\n\n`;
  } else {
    markdown += `| Component ID | Component Name | Last Verified |\n`;
    markdown += `|--------------|----------------|---------------|\n`;
    for (const component of results.verified) {
      markdown += `| ${component.id} | ${component.name} | ${component.lastVerified} |\n`;
    }
    markdown += `\n`;
  }
  
  // Alignment Gaps
  markdown += `## Alignment Gaps\n\n`;
  if (results.alignmentGaps.length === 0) {
    markdown += `No alignment gaps were found.\n\n`;
  } else {
    for (const component of results.alignmentGaps) {
      markdown += `### ${component.name} (${component.id})\n\n`;
      markdown += `**Last Verified:** ${component.lastVerified}\n\n`;
      markdown += `#### Issues\n\n`;
      for (const issue of component.issues) {
        markdown += `- **${issue.type}** (${issue.severity}): ${issue.details || issue.prop}\n`;
        if (issue.implementedDescription && issue.documentedDescription) {
          markdown += `  - Implemented: "${issue.implementedDescription}"\n`;
          markdown += `  - Documented: "${issue.documentedDescription}"\n`;
        }
      }
      markdown += `\n`;
    }
  }
  
  // Documentation Gaps
  markdown += `## Documentation Gaps\n\n`;
  if (results.documentationGaps.length === 0) {
    markdown += `No documentation gaps were found.\n\n`;
  } else {
    markdown += `| Component ID | Component Name | Implementation Location |\n`;
    markdown += `|--------------|----------------|-------------------------|\n`;
    for (const component of results.documentationGaps) {
      markdown += `| ${component.id} | ${component.name} | ${component.implemented.implementationLocation} |\n`;
    }
    markdown += `\n`;
  }
  
  // Implementation Gaps
  markdown += `## Implementation Gaps\n\n`;
  if (results.implementationGaps.length === 0) {
    markdown += `No implementation gaps were found.\n\n`;
  } else {
    markdown += `| Component ID | Component Name | Documentation Location |\n`;
    markdown += `|--------------|----------------|-------------------------|\n`;
    for (const component of results.implementationGaps) {
      markdown += `| ${component.id} | ${component.name} | ${component.documented.documentationLocation} |\n`;
    }
    markdown += `\n`;
  }
  
  // Inventory Updates
  markdown += `## Inventory Updates\n\n`;
  if (results.inventoryUpdates.length === 0) {
    markdown += `No inventory updates are needed.\n\n`;
  } else {
    markdown += `| Component Name | Action | Category | Status | Implementation Location | Documentation Location |\n`;
    markdown += `|----------------|--------|----------|--------|-------------------------|-------------------------|\n`;
    for (const update of results.inventoryUpdates) {
      markdown += `| ${update.name} | ${update.action} | ${update.category || '-'} | ${update.status || '-'} | ${update.implementationLocation || '-'} | ${update.documentationLocation || '-'} |\n`;
    }
    markdown += `\n`;
  }
  
  return markdown;
}

/**
 * Main function to run the verification process
 */
function main() {
  console.log('Starting component verification...');
  
  // Parse the Component Inventory
  console.log('Parsing Component Inventory...');
  const inventoryComponents = parseComponentInventory();
  console.log(`Found ${inventoryComponents.length} components in inventory`);
  
  // Scan implemented components
  console.log('Scanning implemented components...');
  const implementedComponents = scanImplementedComponents();
  console.log(`Found ${implementedComponents.length} implemented components`);
  
  // Scan documented components
  console.log('Scanning documented components...');
  const documentedComponents = scanDocumentedComponents();
  console.log(`Found ${documentedComponents.length} documented components`);
  
  // Verify components
  console.log('Verifying components...');
  const results = verifyComponents(inventoryComponents, implementedComponents, documentedComponents);
  console.log(`Verification complete: ${results.verified.length} verified, ${results.alignmentGaps.length} alignment gaps, ${results.documentationGaps.length} documentation gaps, ${results.implementationGaps.length} implementation gaps, ${results.inventoryUpdates.length} inventory updates`);
  
  // Generate reports
  console.log('Generating reports...');
  generateReports(results);
  
  console.log('Component verification completed successfully.');
}

// Run the main function
main();