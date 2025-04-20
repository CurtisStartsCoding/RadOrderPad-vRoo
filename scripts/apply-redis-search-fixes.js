/**
 * Script to apply Redis search fixes to the main codebase
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Paths to the fixed files
const cptSearchFixPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'cpt-search-fix.ts');
const icd10SearchFixPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'icd10-search-fix.ts');

// Paths to the original files
const cptSearchPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'cpt-search.ts');
const icd10SearchPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'icd10-search.ts');

// Backup the original files
const cptSearchBackupPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'cpt-search.backup.ts');
const icd10SearchBackupPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'icd10-search.backup.ts');

// Function to apply the fixes
async function applyFixes() {
  try {
    console.log('Applying Redis search fixes to the main codebase...');
    
    // Check if the fixed files exist
    if (!fs.existsSync(cptSearchFixPath)) {
      throw new Error(`Fixed CPT search file not found at ${cptSearchFixPath}`);
    }
    
    if (!fs.existsSync(icd10SearchFixPath)) {
      throw new Error(`Fixed ICD-10 search file not found at ${icd10SearchFixPath}`);
    }
    
    // Check if the original files exist
    if (!fs.existsSync(cptSearchPath)) {
      throw new Error(`Original CPT search file not found at ${cptSearchPath}`);
    }
    
    if (!fs.existsSync(icd10SearchPath)) {
      throw new Error(`Original ICD-10 search file not found at ${icd10SearchPath}`);
    }
    
    // Backup the original files
    console.log('Backing up original files...');
    fs.copyFileSync(cptSearchPath, cptSearchBackupPath);
    fs.copyFileSync(icd10SearchPath, icd10SearchBackupPath);
    console.log('Original files backed up successfully.');
    
    // Apply the fixes
    console.log('Applying fixes...');
    fs.copyFileSync(cptSearchFixPath, cptSearchPath);
    fs.copyFileSync(icd10SearchFixPath, icd10SearchPath);
    console.log('Fixes applied successfully.');
    
    // Compile the TypeScript files
    console.log('Compiling TypeScript files...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('TypeScript files compiled successfully.');
    
    console.log('Redis search fixes applied successfully!');
  } catch (error) {
    console.error('Error applying Redis search fixes:', error);
    
    // Try to restore the original files if they were backed up
    try {
      if (fs.existsSync(cptSearchBackupPath)) {
        fs.copyFileSync(cptSearchBackupPath, cptSearchPath);
      }
      
      if (fs.existsSync(icd10SearchBackupPath)) {
        fs.copyFileSync(icd10SearchBackupPath, icd10SearchPath);
      }
      
      console.log('Original files restored after error.');
    } catch (restoreError) {
      console.error('Error restoring original files:', restoreError);
    }
  }
}

// Run the function
applyFixes();