/**
 * Script to help set up the GitHub repository
 * This will organize the root directory and initialize the Git repository
 */
const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute shell commands and log output
function runCommand(command) {
  console.log(`\nExecuting: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return false;
  }
}

// Main function
async function setupGitHub() {
  console.log('=== RadOrderPad GitHub Setup ===\n');
  
  // Step 1: Organize the root directory
  console.log('Step 1: Organizing the root directory...');
  
  if (fs.existsSync('organize-root-directory.js')) {
    const organizePrompt = await new Promise(resolve => {
      rl.question('Do you want to organize the root directory? (y/n): ', resolve);
    });
    
    if (organizePrompt.toLowerCase() === 'y') {
      runCommand('node organize-root-directory.js');
    } else {
      console.log('Skipping directory organization.');
    }
  } else {
    console.log('organize-root-directory.js not found. Skipping directory organization.');
  }
  
  // Step 2: Initialize Git repository
  console.log('\nStep 2: Initializing Git repository...');
  
  // Check if .git directory already exists
  if (fs.existsSync('.git')) {
    console.log('Git repository is already initialized.');
  } else {
    const initPrompt = await new Promise(resolve => {
      rl.question('Do you want to initialize a Git repository? (y/n): ', resolve);
    });
    
    if (initPrompt.toLowerCase() === 'y') {
      runCommand('git init');
    } else {
      console.log('Skipping Git initialization.');
    }
  }
  
  // Step 3: Create .gitignore if it doesn't exist
  console.log('\nStep 3: Checking .gitignore file...');
  
  if (!fs.existsSync('.gitignore')) {
    const gitignorePrompt = await new Promise(resolve => {
      rl.question('.gitignore file not found. Do you want to create one? (y/n): ', resolve);
    });
    
    if (gitignorePrompt.toLowerCase() === 'y') {
      // Create a basic .gitignore file
      const gitignoreContent = `# Node.js dependencies
node_modules/

# Environment variables
.env
.env.*
!.env.example

# Build outputs
dist/
build/

# Logs
logs/
*.log

# Database files
*.sql
*.sqlite
*.db
*.bak

# OS specific files
.DS_Store
Thumbs.db
`;
      
      fs.writeFileSync('.gitignore', gitignoreContent);
      console.log('.gitignore file created.');
    } else {
      console.log('Skipping .gitignore creation.');
    }
  } else {
    console.log('.gitignore file already exists.');
  }
  
  // Step 4: Add files to Git
  console.log('\nStep 4: Adding files to Git...');
  
  const addPrompt = await new Promise(resolve => {
    rl.question('Do you want to add all files to Git? (y/n): ', resolve);
  });
  
  if (addPrompt.toLowerCase() === 'y') {
    runCommand('git add .');
  } else {
    console.log('Skipping adding files to Git.');
  }
  
  // Step 5: Make initial commit
  console.log('\nStep 5: Making initial commit...');
  
  const commitPrompt = await new Promise(resolve => {
    rl.question('Do you want to make the initial commit? (y/n): ', resolve);
  });
  
  if (commitPrompt.toLowerCase() === 'y') {
    const commitMessage = await new Promise(resolve => {
      rl.question('Enter commit message (default: "Initial commit"): ', answer => {
        resolve(answer || 'Initial commit');
      });
    });
    
    runCommand(`git commit -m "${commitMessage}"`);
  } else {
    console.log('Skipping initial commit.');
  }
  
  // Step 6: Set up GitHub remote
  console.log('\nStep 6: Setting up GitHub remote...');
  console.log('To push to GitHub, you need to create a repository on GitHub first.');
  console.log('Go to https://github.com/new to create a new repository.');
  
  const remotePrompt = await new Promise(resolve => {
    rl.question('Have you created a GitHub repository? (y/n): ', resolve);
  });
  
  if (remotePrompt.toLowerCase() === 'y') {
    const repoUrl = await new Promise(resolve => {
      rl.question('Enter your GitHub repository URL: ', resolve);
    });
    
    if (repoUrl) {
      runCommand(`git remote add origin ${repoUrl}`);
      
      // Step 7: Push to GitHub
      console.log('\nStep 7: Pushing to GitHub...');
      
      const pushPrompt = await new Promise(resolve => {
        rl.question('Do you want to push to GitHub now? (y/n): ', resolve);
      });
      
      if (pushPrompt.toLowerCase() === 'y') {
        runCommand('git branch -M main');
        runCommand('git push -u origin main');
      } else {
        console.log('Skipping push to GitHub.');
      }
    } else {
      console.log('No repository URL provided. Skipping remote setup.');
    }
  } else {
    console.log('Please create a GitHub repository before continuing.');
    console.log('You can find detailed instructions in Docs/github_setup_guide.md');
  }
  
  // Finish
  console.log('\n=== Setup Complete ===');
  console.log('For more detailed instructions, see Docs/github_setup_guide.md');
  
  rl.close();
}

// Run the setup function
setupGitHub().catch(error => {
  console.error('Error:', error);
  rl.close();
});