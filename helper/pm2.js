const pm2 = require('pm2');

// Function to start a PM2 process
const startProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.start(processName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to stop a PM2 process
const stopProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.stop(processName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to list PM2 processes
const listProcesses = () => {
  return new Promise((resolve, reject) => {
    pm2.list((err, processes) => {
      if (err) {
        reject(err);
      } else {
        resolve(processes);
      }
    });
  });
};

// Exporting the functions
module.exports = {
  startProcess,
  stopProcess,
  listProcesses,
};