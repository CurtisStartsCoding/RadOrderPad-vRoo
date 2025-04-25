/**
 * Script to generate authentication tokens for all roles in the system
 * This script logs in with test credentials for each role and saves the tokens to separate files
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'tokens');

// Test user credentials for all roles
const TEST_USERS = [
  {
    role: 'admin_staff',
    email: 'test.admin_staff@example.com',
    password: 'password123'
  },
  {
    role: 'physician',
    email: 'test.physician@example.com',
    password: 'password123'
  },
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'password123'
  },
  {
    role: 'super_admin',
    email: 'superadmin.20141244@example.com',
    password: 'password123'
  },
  {
    role: 'admin_radiology',
    email: 'test.admin_radiology@example.com',
    password: 'password123'
  },
  {
    role: 'scheduler',
    email: 'test.scheduler@example.com',
    password: 'password123'
  },
  {
    role: 'radiologist',
    email: 'test.radiologist@example.com',
    password: 'password123'
  }
];

// Results tracking
const results = {
  passed: 0,
  failed: 0,
  roles: {}
};

// Function to generate token for a specific user
async function generateToken(user) {
  console.log(`\n🔑 Generating token for ${user.role} role...`);
  console.log(`   Email: ${user.email}`);
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: user.email,
      password: user.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data || !response.data.token) {
      console.error(`❌ Error: No token received for ${user.role}`);
      results.failed++;
      results.roles[user.role] = {
        status: 'failed',
        error: 'No token in response'
      };
      return null;
    }
    
    const token = response.data.token;
    console.log(`✅ Token received successfully for ${user.role}`);
    
    // Save token to file
    const outputFile = path.join(OUTPUT_DIR, `${user.role}-token.txt`);
    fs.writeFileSync(outputFile, token, 'utf8');
    console.log(`   Token saved to ${outputFile}`);
    
    results.passed++;
    results.roles[user.role] = {
      status: 'success',
      tokenFile: outputFile
    };
    
    return token;
  } catch (error) {
    console.error(`❌ Failed to generate token for ${user.role}`);
    results.failed++;
    results.roles[user.role] = {
      status: 'failed',
      error: error.message,
      statusCode: error.response?.status,
      errorMessage: error.response?.data?.message
    };
    
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

// Main function to generate tokens for all roles
async function generateAllTokens() {
  console.log('=== GENERATING TOKENS FOR ALL ROLES ===');
  console.log(`API URL: ${API_URL}`);
  console.log('=======================================\n');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
  
  // Generate tokens for all roles
  for (const user of TEST_USERS) {
    await generateToken(user);
  }
  
  // Print summary
  console.log('\n=== TOKEN GENERATION SUMMARY ===');
  console.log(`Total Roles: ${TEST_USERS.length}`);
  console.log(`Successful: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  console.log('\n=== RESULTS BY ROLE ===');
  for (const [role, result] of Object.entries(results.roles)) {
    if (result.status === 'success') {
      console.log(`✅ ${role}: Token generated successfully`);
      console.log(`   File: ${result.tokenFile}`);
    } else {
      console.log(`❌ ${role}: Failed - ${result.statusCode} ${result.errorMessage || result.error}`);
    }
  }
  
  // Create a convenience script to set environment variables for tokens
  createConvenienceScripts();
  
  console.log('\n=== TOKEN GENERATION COMPLETE ===');
}

// Function to create convenience scripts for setting environment variables
function createConvenienceScripts() {
  console.log('\nCreating convenience scripts for setting token environment variables...');
  
  // Windows batch script
  let batchContent = '@echo off\n';
  batchContent += 'echo Setting token environment variables...\n\n';
  
  for (const user of TEST_USERS) {
    const tokenFile = path.join(OUTPUT_DIR, `${user.role}-token.txt`);
    const varName = `${user.role.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_TOKEN`;
    batchContent += `set /p ${varName}=<${tokenFile}\n`;
    batchContent += `echo ${varName} set\n`;
  }
  
  batchContent += '\necho All token environment variables set successfully.\n';
  fs.writeFileSync(path.join(__dirname, '..', '..', 'set-token-env-vars.bat'), batchContent, 'utf8');
  console.log('Created Windows batch script: set-token-env-vars.bat');
  
  // PowerShell script
  let psContent = '# PowerShell script to set token environment variables\n';
  psContent += 'Write-Host "Setting token environment variables..." -ForegroundColor Green\n\n';
  
  for (const user of TEST_USERS) {
    const tokenFile = path.join(OUTPUT_DIR, `${user.role}-token.txt`);
    const varName = `${user.role.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_TOKEN`;
    psContent += `$env:${varName} = Get-Content -Path "${tokenFile}"\n`;
    psContent += `Write-Host "${varName} set" -ForegroundColor Cyan\n`;
  }
  
  psContent += '\nWrite-Host "All token environment variables set successfully." -ForegroundColor Green\n';
  fs.writeFileSync(path.join(__dirname, '..', '..', 'Set-TokenEnvVars.ps1'), psContent, 'utf8');
  console.log('Created PowerShell script: Set-TokenEnvVars.ps1');
}

// Run the main function
generateAllTokens().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});