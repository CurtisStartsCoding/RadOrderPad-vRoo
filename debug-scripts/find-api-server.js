/**
 * Script to find only the API server process
 * This is safer than killing all Node processes
 */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to find running server processes with more specific filtering
function findApiServerProcess() {
  return new Promise((resolve, reject) => {
    // Use different commands based on the OS
    let command;
    
    if (process.platform === 'win32') {
      // For Windows, use netstat to find processes listening on port 3000
      command = 'netstat -ano | findstr :3000';
    } else {
      // For Unix-like systems, use lsof to find processes listening on port 3000
      command = 'lsof -i :3000';
    }
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 1) {
          console.log('No processes found listening on port 3000');
          resolve([]);
        } else {
          console.error(`Error finding server processes: ${error.message}`);
          reject(error);
        }
        return;
      }
      
      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }
      
      // Parse the output to find PIDs
      const pids = [];
      const lines = stdout.trim().split('\n');
      
      if (process.platform === 'win32') {
        // Parse Windows netstat output
        for (const line of lines) {
          // Skip header lines
          if (line.includes('Proto') || line.trim() === '') continue;
          
          // Extract the PID (last column)
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5) {
            const pid = parts[parts.length - 1];
            if (!pids.includes(pid)) {
              pids.push(pid);
            }
          }
        }
      } else {
        // Parse Unix lsof output
        for (let i = 1; i < lines.length; i++) { // Skip header line
          const parts = lines[i].trim().split(/\s+/);
          if (parts.length >= 2) {
            const pid = parts[1];
            if (!pids.includes(pid)) {
              pids.push(pid);
            }
          }
        }
      }
      
      resolve(pids);
    });
  });
}

// Function to get process details
function getProcessDetails(pid) {
  return new Promise((resolve, reject) => {
    let command;
    
    if (process.platform === 'win32') {
      command = `tasklist /fi "PID eq ${pid}" /fo csv /nh`;
    } else {
      command = `ps -p ${pid} -o comm=,args=`;
    }
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error getting process details for PID ${pid}: ${error.message}`);
        resolve({ pid, name: 'Unknown', command: 'Unknown' });
        return;
      }
      
      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }
      
      let processName = 'Unknown';
      let processCommand = 'Unknown';
      
      if (process.platform === 'win32') {
        // Parse Windows tasklist output (CSV format)
        const match = stdout.match(/"([^"]+)","([^"]+)"/);
        if (match) {
          processName = match[1];
          processCommand = match[2];
        }
      } else {
        // Parse Unix ps output
        const parts = stdout.trim().split(/\s+/);
        if (parts.length >= 1) {
          processName = parts[0];
          processCommand = parts.slice(1).join(' ');
        }
      }
      
      resolve({ pid, name: processName, command: processCommand });
    });
  });
}

// Main function
async function main() {
  try {
    console.log('Looking for API server processes (listening on port 3000)...');
    const pids = await findApiServerProcess();
    
    if (pids.length === 0) {
      console.log('No API server processes found listening on port 3000');
    } else {
      console.log(`Found ${pids.length} process(es) listening on port 3000:`);
      
      // Get details for each process
      for (const pid of pids) {
        const details = await getProcessDetails(pid);
        console.log(`- PID: ${details.pid}, Process: ${details.name}`);
        
        // Check if this is likely our API server
        if (details.name.toLowerCase().includes('node')) {
          console.log(`  This appears to be a Node.js process and is likely our API server.`);
          console.log(`  To restart it, you can manually kill this process and start the server again.`);
          console.log(`  On Windows: taskkill /F /PID ${details.pid}`);
          console.log(`  On Unix: kill -9 ${details.pid}`);
        } else {
          console.log(`  This does not appear to be our Node.js API server.`);
        }
      }
    }
    
    console.log('\nTo start the server after stopping it, you can use:');
    console.log('npm start');
    console.log('or');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
});