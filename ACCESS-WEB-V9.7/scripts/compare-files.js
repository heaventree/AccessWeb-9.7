/**
 * File Comparison Tool
 * 
 * This script compares files between ACCESS-WEB-V9.7 and WCAG9.4-audit repositories
 * to help identify differences during the consolidation process.
 * 
 * Usage: node compare-files.js [file-path]
 * 
 * Examples:
 *   node compare-files.js src/utils/auth.ts
 *   node compare-files.js src/components/accessibility
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Repository paths
const REPO1 = path.resolve(__dirname, '..');  // ACCESS-WEB-V9.7
const REPO2 = path.resolve(__dirname, '../../WCAG9.4-audit');  // WCAG9.4-audit

// File or directory to compare
const targetPath = process.argv[2] || '.';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Compare two files and return differences
 * @param {string} file1 - Path to first file
 * @param {string} file2 - Path to second file
 * @returns {string} - Diff output
 */
function compareFiles(file1, file2) {
  try {
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
      return null;
    }
    
    // Run diff command
    const diff = execSync(`diff -u "${file1}" "${file2}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return diff;
  } catch (error) {
    // diff returns non-zero exit code if files are different
    return error.stdout;
  }
}

/**
 * Check if files are identical
 * @param {string} file1 - Path to first file
 * @param {string} file2 - Path to second file
 * @returns {boolean} - True if files are identical
 */
function areFilesIdentical(file1, file2) {
  try {
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
      return false;
    }
    
    execSync(`diff -q "${file1}" "${file2}"`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Compare directories recursively
 * @param {string} dir1 - Path to first directory
 * @param {string} dir2 - Path to second directory
 * @param {string} relativePath - Relative path for reporting
 */
function compareDirectories(dir1, dir2, relativePath = '') {
  // Check if directories exist
  if (!fs.existsSync(dir1) || !fs.existsSync(dir2)) {
    console.log(`${colors.red}Directory does not exist in both repositories${colors.reset}`);
    if (!fs.existsSync(dir1)) console.log(`  Missing: ${dir1}`);
    if (!fs.existsSync(dir2)) console.log(`  Missing: ${dir2}`);
    return;
  }
  
  // Get files in first directory
  const files1 = fs.readdirSync(dir1);
  
  // Get files in second directory
  const files2 = fs.readdirSync(dir2);
  
  // Combine unique filenames
  const allFiles = [...new Set([...files1, ...files2])].sort();
  
  console.log(`\n${colors.cyan}Comparing ${relativePath || '.'}${colors.reset}\n`);
  
  // Track statistics
  let identical = 0;
  let different = 0;
  let uniqueToRepo1 = 0;
  let uniqueToRepo2 = 0;
  
  // Compare each file
  for (const file of allFiles) {
    const filePath1 = path.join(dir1, file);
    const filePath2 = path.join(dir2, file);
    const relativeFilePath = path.join(relativePath, file);
    
    const stat1 = fs.existsSync(filePath1) ? fs.statSync(filePath1) : null;
    const stat2 = fs.existsSync(filePath2) ? fs.statSync(filePath2) : null;
    
    // Both are directories
    if (stat1?.isDirectory() && stat2?.isDirectory()) {
      compareDirectories(filePath1, filePath2, relativeFilePath);
      continue;
    }
    
    // One is directory, one is file
    if ((stat1?.isDirectory() && !stat2?.isDirectory()) || 
        (!stat1?.isDirectory() && stat2?.isDirectory())) {
      console.log(`${colors.yellow}Type mismatch: ${relativeFilePath}${colors.reset}`);
      console.log(`  ${REPO1}: ${stat1?.isDirectory() ? 'Directory' : 'File'}`);
      console.log(`  ${REPO2}: ${stat2?.isDirectory() ? 'Directory' : 'File'}`);
      continue;
    }
    
    // File exists only in first repository
    if (stat1 && !stat2) {
      console.log(`${colors.green}Only in ${REPO1}: ${relativeFilePath}${colors.reset}`);
      uniqueToRepo1++;
      continue;
    }
    
    // File exists only in second repository
    if (!stat1 && stat2) {
      console.log(`${colors.magenta}Only in ${REPO2}: ${relativeFilePath}${colors.reset}`);
      uniqueToRepo2++;
      continue;
    }
    
    // Both are files - compare them
    if (areFilesIdentical(filePath1, filePath2)) {
      console.log(`${colors.blue}Identical: ${relativeFilePath}${colors.reset}`);
      identical++;
    } else {
      console.log(`${colors.red}Different: ${relativeFilePath}${colors.reset}`);
      different++;
      
      // Show diff for the file
      if (process.argv.includes('--diff')) {
        const diff = compareFiles(filePath1, filePath2);
        if (diff) {
          console.log('\nDifferences:');
          console.log(diff);
          console.log();
        }
      }
    }
  }
  
  // Print statistics
  console.log(`\n${colors.cyan}Summary for ${relativePath || '.'}:${colors.reset}`);
  console.log(`  Identical: ${identical}`);
  console.log(`  Different: ${different}`);
  console.log(`  Only in ${REPO1}: ${uniqueToRepo1}`);
  console.log(`  Only in ${REPO2}: ${uniqueToRepo2}`);
  console.log(`  Total: ${identical + different + uniqueToRepo1 + uniqueToRepo2}`);
}

// Main function
function main() {
  const sourcePath1 = path.join(REPO1, targetPath);
  const sourcePath2 = path.join(REPO2, targetPath);
  
  console.log(`${colors.cyan}Comparing repositories:${colors.reset}`);
  console.log(`  1: ${REPO1}`);
  console.log(`  2: ${REPO2}`);
  console.log(`  Target: ${targetPath}`);
  
  if (fs.existsSync(sourcePath1) && fs.existsSync(sourcePath2)) {
    const stat1 = fs.statSync(sourcePath1);
    const stat2 = fs.statSync(sourcePath2);
    
    if (stat1.isDirectory() && stat2.isDirectory()) {
      compareDirectories(sourcePath1, sourcePath2, targetPath);
    } else if (stat1.isFile() && stat2.isFile()) {
      if (areFilesIdentical(sourcePath1, sourcePath2)) {
        console.log(`${colors.blue}Files are identical${colors.reset}`);
      } else {
        console.log(`${colors.red}Files are different${colors.reset}`);
        
        // Show diff for the file
        const diff = compareFiles(sourcePath1, sourcePath2);
        if (diff) {
          console.log('\nDifferences:');
          console.log(diff);
        }
      }
    } else {
      console.log(`${colors.yellow}Type mismatch: One is a file, the other is a directory${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}Target does not exist in both repositories${colors.reset}`);
    if (!fs.existsSync(sourcePath1)) console.log(`  Missing: ${sourcePath1}`);
    if (!fs.existsSync(sourcePath2)) console.log(`  Missing: ${sourcePath2}`);
  }
}

// Run the program
main();