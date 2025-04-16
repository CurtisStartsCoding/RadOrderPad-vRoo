/**
 * Simple GitHub setup script
 * This script provides a straightforward way to initialize a Git repository and push to GitHub
 * while keeping your repository clean and uncluttered
 */
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

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

// Function to ask a yes/no question
async function askYesNo(question, defaultYes = true) {
  const defaultText = defaultYes ? 'Y/n' : 'y/N';
  const response = await new Promise(resolve => {
    rl.question(`${question} [${defaultText}]: `, resolve);
  });
  
  if (response.trim() === '') {
    return defaultYes;
  }
  
  return response.toLowerCase() === 'y';
}

// Main function
async function setupGitHub() {
  console.log('=== Simple GitHub Setup for RadOrderPad ===\n');
  console.log('This script will help you set up a clean, uncluttered GitHub repository.\n');
  
  // Step 1: Initialize Git repository
  console.log('Step 1: Initializing Git repository...');
  
  // Check if .git directory already exists
  if (fs.existsSync('.git')) {
    console.log('Git repository is already initialized.');
  } else {
    if (await askYesNo('Initialize a Git repository?')) {
      runCommand('git init');
    } else {
      console.log('Skipping Git initialization.');
    }
  }
  
  // Step 2: Review .gitignore
  console.log('\nStep 2: Reviewing .gitignore file...');
  
  if (fs.existsSync('.gitignore')) {
    console.log('A .gitignore file already exists with the following content:');
    console.log(fs.readFileSync('.gitignore', 'utf8'));
    
    if (await askYesNo('Would you like to review which files will be excluded?')) {
      console.log('\nThe following patterns will be excluded from your repository:');
      
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      const lines = gitignore.split('\n');
      
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#') && !line.startsWith('!')) {
          console.log(`- ${line}`);
        }
      }
      
      console.log('\nThe following patterns will be explicitly included (exceptions to exclusions):');
      
      for (const line of lines) {
        if (line.trim() && line.startsWith('!')) {
          console.log(`- ${line.substring(1)}`);
        }
      }
      
      console.log('\nYou can edit the .gitignore file directly if you want to change what gets included or excluded.');
    }
  } else {
    console.log('No .gitignore file found.');
    
    if (await askYesNo('Create a basic .gitignore file?')) {
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

# Large database files
Data/*.sql
Data/batches/
Data/tables/
Data/upsert/
*_backup_*.sql

# Keep important SQL schema files
!radorderpad_schema.sql
!import_cpt_codes.sql
!update_prompt_template.sql

# OS specific files
.DS_Store
Thumbs.db
`;
      
      fs.writeFileSync('.gitignore', gitignoreContent);
      console.log('.gitignore file created.');
    } else {
      console.log('Skipping .gitignore creation.');
    }
  }
  
  // Step 3: Organize files (optional)
  console.log('\nStep 3: Organizing files (optional)...');
  
  if (fs.existsSync('organize-root-directory.js')) {
    if (await askYesNo('Would you like to organize loose files in the root directory?', false)) {
      runCommand('node organize-root-directory.js');
    } else {
      console.log('Skipping file organization.');
    }
  } else {
    console.log('organize-root-directory.js not found. Skipping file organization.');
  }
  
  // Step 4: Add files to Git
  console.log('\nStep 4: Adding files to Git...');
  
  if (await askYesNo('Add all files to Git (respecting .gitignore)?')) {
    runCommand('git add .');
    
    // Show what's being added
    console.log('\nThe following files will be added to the repository:');
    runCommand('git status');
  } else {
    console.log('Skipping adding files to Git.');
  }
  
  // Step 5: Make initial commit
  console.log('\nStep 5: Making initial commit...');
  
  if (await askYesNo('Make the initial commit?')) {
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
  
  if (await askYesNo('Have you created a GitHub repository?', false)) {
    const repoUrl = await new Promise(resolve => {
      rl.question('Enter your GitHub repository URL: ', resolve);
    });
    
    if (repoUrl) {
      runCommand(`git remote add origin ${repoUrl}`);
      
      // Step 7: Push to GitHub
      console.log('\nStep 7: Pushing to GitHub...');
      
      if (await askYesNo('Push to GitHub now?')) {
        runCommand('git branch -M main');
        runCommand('git push -u origin main');
      } else {
        console.log('Skipping push to GitHub.');
        console.log('\nTo push later, run:');
        console.log('git branch -M main');
        console.log('git push -u origin main');
      }
    } else {
      console.log('No repository URL provided. Skipping remote setup.');
    }
  } else {
    console.log('\nWhen you create a GitHub repository, you can set it up with:');
    console.log('git remote add origin https://github.com/yourusername/RadOrderPad.git');
    console.log('git branch -M main');
    console.log('git push -u origin main');
  }
  
  // Finish
  console.log('\n=== Setup Complete ===');
  console.log('Your repository is now ready for GitHub.');
  
  rl.close();
}

// Run the setup function
setupGitHub().catch(error => {
  console.error('Error:', error);
  rl.close();
});