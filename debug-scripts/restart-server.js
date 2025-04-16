/**
 * Script to restart the server
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to find running server processes
function findServerProcesses() {
  return new Promise((resolve, reject) => {
    // Use different commands based on the OS
    const command = process.platform === 'win32' 
      ? 'tasklist /fi "imagename eq node.exe" /fo csv /nh' 
      : 'ps aux | grep node';
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error finding server processes: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }
      
      resolve(stdout);
    });
  });
}

// Function to kill a process by PID
function killProcess(pid) {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' 
      ? `taskkill /F /PID ${pid}` 
      : `kill -9 ${pid}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing process ${pid}: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }
      
      console.log(`Process ${pid} killed successfully`);
      resolve();
    });
  });
}

// Function to start the server
function startServer() {
  return new Promise((resolve, reject) => {
    // Determine the server start command based on package.json
    let startCommand = 'npm start';
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.scripts && packageJson.scripts.start) {
        startCommand = `npm run ${Object.keys(packageJson.scripts).find(script => 
          script === 'start' || 
          script === 'dev' || 
          script === 'serve' || 
          packageJson.scripts[script].includes('server')
        )}`;
      }
    } catch (error) {
      console.warn(`Could not determine start command from package.json: ${error.message}`);
      console.warn('Using default "npm start" command');
    }
    
    console.log(`Starting server with command: ${startCommand}`);
    
    // Start the server in a new terminal window
    const command = process.platform === 'win32' 
      ? `start cmd.exe /K "${startCommand}"` 
      : `osascript -e 'tell app "Terminal" to do script "${startCommand}"'`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }
      
      console.log('Server started successfully');
      resolve();
    });
  });
}

async function restartServer() {
  try {
    console.log('Looking for server processes...');
    const processes = await findServerProcesses();
    
    // Parse the process list based on OS
    const serverProcesses = [];
    
    if (process.platform === 'win32') {
      // Parse CSV output from tasklist
      const lines = processes.split('\n');
      for (const line of lines) {
        if (line.includes('node.exe')) {
          const parts = line.split('","');
          if (parts.length >= 2) {
            const pid = parts[1].replace('"', '');
            serverProcesses.push(pid);
          }
        }
      }
    } else {
      // Parse output from ps aux
      const lines = processes.split('\n');
      for (const line of lines) {
        if (line.includes('node') && !line.includes('grep')) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            serverProcesses.push(parts[1]);
          }
        }
      }
    }
    
    if (serverProcesses.length === 0) {
      console.log('No server processes found');
    } else {
      console.log(`Found ${serverProcesses.length} server processes`);
      
      // Ask for confirmation before killing processes
      console.log('The following processes will be killed:');
      serverProcesses.forEach(pid => console.log(`- PID: ${pid}`));
      
      // Kill all server processes
      for (const pid of serverProcesses) {
        await killProcess(pid);
      }
    }
    
    // Start the server
    await startServer();
    
    console.log('Server restart completed successfully');
    console.log('Please wait a few moments for the server to fully initialize before running tests');
    
  } catch (error) {
    console.error('Error restarting server:', error);
  }
}

// Run the restart function
restartServer();