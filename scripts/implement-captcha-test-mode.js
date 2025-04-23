/**
 * Script to implement CAPTCHA test mode in the server code
 * 
 * This script modifies the server code to support testing the registration with CAPTCHA verification.
 * It makes the following changes:
 * 1. Modifies the captcha.ts file to bypass verification in test mode
 * 2. Updates the registration controller to use the test mode flag
 * 3. Adds a test endpoint that bypasses CAPTCHA verification
 */

const fs = require('fs');
const path = require('path');

// Paths to the files we need to modify
const captchaPath = path.join(__dirname, '..', 'src', 'utils', 'captcha.ts');
const registerControllerPath = path.join(__dirname, '..', 'src', 'controllers', 'auth', 'register.controller.ts');
const authRoutesPath = path.join(__dirname, '..', 'src', 'routes', 'auth.routes.ts');

// Backup the original files
function backupFile(filePath) {
  const backupPath = `${filePath}.bak`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up ${filePath} to ${backupPath}`);
  }
}

// Modify the captcha.ts file
function modifyCaptchaFile() {
  backupFile(captchaPath);
  
  const captchaContent = fs.readFileSync(captchaPath, 'utf8');
  
  // Check if the file has already been modified
  if (captchaContent.includes('isTestMode')) {
    console.log('captcha.ts has already been modified');
    return;
  }
  
  // Replace the verifyCaptcha function with the modified version
  const modifiedContent = captchaContent.replace(
    /export async function verifyCaptcha\(token: string\): Promise<boolean> {[\s\S]*?}/,
    `export async function verifyCaptcha(token: string, isTestMode = false): Promise<boolean> {
  // Bypass verification in test mode
  if (isTestMode || process.env.NODE_ENV === 'development' || process.env.TEST_MODE === 'true') {
    enhancedLogger.info('CAPTCHA verification bypassed in test mode');
    return true;
  }
  
  try {
    // Get the reCAPTCHA secret key from environment variables
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!recaptchaSecretKey) {
      enhancedLogger.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
      return false;
    }
    
    // Verify the token with the reCAPTCHA API
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: recaptchaSecretKey,
          response: token
        }
      }
    );
    
    // Check if the verification was successful
    if (response.data && response.data.success) {
      return true;
    }
    
    return false;
  } catch (error) {
    enhancedLogger.error('Error verifying CAPTCHA:', error);
    return false;
  }
}`
  );
  
  fs.writeFileSync(captchaPath, modifiedContent);
  console.log('Modified captcha.ts');
}

// Modify the register.controller.ts file
function modifyRegisterController() {
  backupFile(registerControllerPath);
  
  const controllerContent = fs.readFileSync(registerControllerPath, 'utf8');
  
  // Check if the file has already been modified
  if (controllerContent.includes('isTestMode')) {
    console.log('register.controller.ts has already been modified');
    return;
  }
  
  // Replace the CAPTCHA verification code with the modified version
  const modifiedContent = controllerContent.replace(
    /const captchaValid = await verifyCaptcha\(captchaToken\);/,
    `// Check for test mode
    const isTestMode = req.headers['x-test-mode'] === 'true' || 
                      process.env.NODE_ENV === 'development' || 
                      process.env.TEST_MODE === 'true';
    
    const captchaValid = await verifyCaptcha(captchaToken, isTestMode);`
  );
  
  fs.writeFileSync(registerControllerPath, modifiedContent);
  console.log('Modified register.controller.ts');
}

// Modify the auth.routes.ts file
function modifyAuthRoutes() {
  backupFile(authRoutesPath);
  
  const routesContent = fs.readFileSync(authRoutesPath, 'utf8');
  
  // Check if the file has already been modified
  if (routesContent.includes('/register-test')) {
    console.log('auth.routes.ts has already been modified');
    return;
  }
  
  // Add the test endpoint
  const importRegex = /import \{ Router \} from 'express';/;
  const modifiedImport = `import { Router } from 'express';
import registerController from '../controllers/auth/register.controller';`;
  
  let modifiedContent = routesContent.replace(importRegex, modifiedImport);
  
  // Find the position to add the test endpoint
  const routerRegex = /const router = Router\(\);/;
  const routerMatch = modifiedContent.match(routerRegex);
  
  if (routerMatch) {
    const position = routerMatch.index + routerMatch[0].length;
    const beforeRouter = modifiedContent.substring(0, position);
    const afterRouter = modifiedContent.substring(position);
    
    modifiedContent = `${beforeRouter}

// Add a test endpoint that bypasses CAPTCHA verification
router.post('/register-test', (req, res, next) => {
  // Set the test mode header
  req.headers['x-test-mode'] = 'true';
  // Call the regular register controller
  registerController.register(req, res);
});
${afterRouter}`;
  }
  
  fs.writeFileSync(authRoutesPath, modifiedContent);
  console.log('Modified auth.routes.ts');
}

// Main function
function main() {
  try {
    console.log('Implementing CAPTCHA test mode...');
    
    // Check if the files exist
    if (!fs.existsSync(captchaPath)) {
      console.error(`File not found: ${captchaPath}`);
      return;
    }
    
    if (!fs.existsSync(registerControllerPath)) {
      console.error(`File not found: ${registerControllerPath}`);
      return;
    }
    
    if (!fs.existsSync(authRoutesPath)) {
      console.error(`File not found: ${authRoutesPath}`);
      return;
    }
    
    // Modify the files
    modifyCaptchaFile();
    modifyRegisterController();
    modifyAuthRoutes();
    
    console.log('CAPTCHA test mode implemented successfully');
    console.log('You need to rebuild and redeploy the application for the changes to take effect');
  } catch (error) {
    console.error('Error implementing CAPTCHA test mode:', error);
  }
}

// Run the script
main();