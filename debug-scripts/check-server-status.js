/**
 * Script to check if the server is running on port 3000
 */
const http = require('http');
const { exec } = require('child_process');

// Function to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const options = {
      host: 'localhost',
      port: port,
      timeout: 1000
    };

    const req = http.get(options, (res) => {
      console.log(`Server is running on port ${port}`);
      console.log(`Status code: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      resolve(true);
    });

    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.log(`No server running on port ${port}`);
      } else {
        console.log(`Error checking port ${port}: ${err.message}`);
      }
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`Timeout checking port ${port}`);
      req.abort();
      resolve(false);
    });
  });
}

// Function to check which processes are using a specific port (Windows)
function checkProcessesOnPortWindows(port) {
  return new Promise((resolve, reject) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 1) {
          console.log(`No processes found using port ${port}`);
          resolve([]);
        } else {
          console.error(`Error checking processes on port ${port}: ${error.message}`);
          reject(error);
        }
        return;
      }

      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }

      const lines = stdout.trim().split('\n');
      const processes = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[4];
          processes.push(pid);
        }
      }

      if (processes.length > 0) {
        console.log(`Processes using port ${port}:`);
        
        // Get process names for each PID
        const promises = processes.map(pid => {
          return new Promise((resolve) => {
            exec(`tasklist /fi "PID eq ${pid}" /fo csv /nh`, (error, stdout) => {
              if (error) {
                resolve(`PID: ${pid} (Unable to get process name)`);
              } else {
                const match = stdout.match(/"([^"]+)","([^"]+)"/);
                if (match) {
                  resolve(`PID: ${pid}, Process: ${match[1]}`);
                } else {
                  resolve(`PID: ${pid} (Unable to parse process name)`);
                }
              }
            });
          });
        });

        Promise.all(promises).then(results => {
          results.forEach(result => console.log(result));
          resolve(processes);
        });
      } else {
        console.log(`No processes found using port ${port}`);
        resolve([]);
      }
    });
  });
}

// Function to check which processes are using a specific port (Unix)
function checkProcessesOnPortUnix(port) {
  return new Promise((resolve, reject) => {
    exec(`lsof -i :${port}`, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 1) {
          console.log(`No processes found using port ${port}`);
          resolve([]);
        } else {
          console.error(`Error checking processes on port ${port}: ${error.message}`);
          reject(error);
        }
        return;
      }

      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }

      const lines = stdout.trim().split('\n');
      if (lines.length <= 1) {
        console.log(`No processes found using port ${port}`);
        resolve([]);
        return;
      }

      console.log(`Processes using port ${port}:`);
      console.log(stdout);

      const processes = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);
        if (parts.length >= 2) {
          processes.push(parts[1]);
        }
      }

      resolve(processes);
    });
  });
}

// Main function
async function main() {
  const port = 3000;
  
  console.log(`Checking if server is running on port ${port}...`);
  const isRunning = await checkPort(port);
  
  if (!isRunning) {
    console.log(`\nChecking which processes might be using port ${port}...`);
    if (process.platform === 'win32') {
      await checkProcessesOnPortWindows(port);
    } else {
      await checkProcessesOnPortUnix(port);
    }
  }
  
  // Check for other common ports that might be used
  const otherPorts = [3001, 3002, 3003, 5000, 8000, 8080];
  for (const otherPort of otherPorts) {
    console.log(`\nChecking if server might be running on port ${otherPort}...`);
    await checkPort(otherPort);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
});