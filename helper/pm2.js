const pm2 = require('pm2');

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

const startProcess = (scriptPath, options = {}) => {
  return new Promise((resolve, reject) => {
    pm2.start(scriptPath, options, (err, proc) => {
      if (err) {
        reject(err);
      } else {
        resolve(proc);
      }
    });
  });
};

const stopProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.stop(processName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Stopped PM2 process: ${processName}` });
      }
    });
  });
};

const restartProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.restart(processName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Restarted PM2 process: ${processName}` });
      }
    });
  });
};

const deleteProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.delete(processName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Deleted PM2 process: ${processName}` });
      }
    });
  });
};

const describeProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.describe(processName, (err, description) => {
      if (err) {
        reject(err);
      } else {
        resolve(description);
      }
    });
  });
};

const getLogs = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.logs(processName, (err, logs) => {
      if (err) {
        reject(err);
      } else {
        resolve(logs);
      }
    });
  });
};

// Exporting the functions
module.exports = {
  startProcess,
  stopProcess,
  listProcesses,
  restartProcess,
  deleteProcess,
  describeProcess,
  getLogs
};