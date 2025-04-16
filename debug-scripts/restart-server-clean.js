/**
 * Script to cleanly stop and restart the server
 */
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  return new Promise((resolve) => {
    // Determine the server start command based on package.json
    let startCommand = 'npm start';
    let startScript = 'start';
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.scripts) {
        if (packageJson.scripts.dev) {
          startScript = 'dev';
        } else if (packageJson.scripts.serve) {
          startScript = 'serve';
        }
        
        startCommand = `npm run ${startScript}`;
      }
    } catch (error) {
      console.warn(`Could not determine start command from package.json: ${error.message}`);
      console.warn('Using default "npm start" command');
    }
    
    console.log(`Starting server with command: ${startCommand}`);
    
    // Start the server in a new terminal window
    if (process.platform === 'win32') {
      // For Windows, open a new command prompt window
      const startProcess = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', startCommand], {
        detached: true,
        stdio: 'ignore'
      });
      
      startProcess.unref();
      console.log('Server started in a new window');
      resolve();
    } else {
      // For Unix-like systems, use osascript (Mac) or xterm (Linux)
      const isMac = process.platform === 'darwin';
      
      if (isMac) {
        exec(`osascript -e 'tell app "Terminal" to do script "${startCommand}"'`, (error) => {
          if (error) {
            console.error(`Error starting server: ${error.message}`);
          } else {
            console.log('Server started in a new terminal window');
          }
          resolve();
        });
      } else {
        // Linux
        exec(`xterm -e "${startCommand}"`, (error) => {
          if (error) {
            console.error(`Error starting server: ${error.message}`);
          } else {
            console.log('Server started in a new terminal window');
          }
          resolve();
        });
      }
    }
  });
}

// Function to ask for confirmation
function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Main function
async function main() {
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
      console.log(`Found ${serverProcesses.length} server processes:`);
      
      // Get process names for each PID
      for (const pid of serverProcesses) {
        try {
          const command = process.platform === 'win32'
            ? `tasklist /fi "PID eq ${pid}" /fo csv /nh`
            : `ps -p ${pid} -o comm=`;
          
          exec(command, (error, stdout) => {
            if (!error && stdout) {
              let processName = stdout.trim();
              if (process.platform === 'win32') {
                const match = stdout.match(/"([^"]+)"/);
                if (match) {
                  processName = match[1];
                }
              }
              console.log(`- PID: ${pid}, Process: ${processName}`);
            } else {
              console.log(`- PID: ${pid}`);
            }
          });
        } catch (error) {
          console.log(`- PID: ${pid}`);
        }
      }
      
      // Ask for confirmation before killing processes
      const confirmed = await askForConfirmation('\nDo you want to kill these processes? (y/n): ');
      
      if (confirmed) {
        // Kill all server processes
        for (const pid of serverProcesses) {
          try {
            await killProcess(pid);
          } catch (error) {
            console.error(`Failed to kill process ${pid}: ${error.message}`);
          }
        }
        
        console.log('\nAll server processes have been stopped');
      } else {
        console.log('\nOperation cancelled');
        return;
      }
    }
    
    // Ask if the user wants to start the server
    const startConfirmed = await askForConfirmation('\nDo you want to start the server? (y/n): ');
    
    if (startConfirmed) {
      await startServer();
      console.log('\nServer restart process completed');
      console.log('Please wait a few moments for the server to fully initialize before running tests');
    } else {
      console.log('\nServer not started');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
});