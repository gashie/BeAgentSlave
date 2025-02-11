const pm2 = require("pm2");

const listProcesses = () => {
  return new Promise((resolve, reject) => {
    pm2.list((err, processes) => {
      if (err) {
        return reject(err);
      }

      // Extract required values
      const totalApps = processes.length;
      const avgCPU = processes.reduce((acc, p) => acc + p.monit.cpu, 0) / totalApps;
      const avgMemory = processes.reduce((acc, p) => acc + p.monit.memory, 0) / totalApps;
      const avgLatency = processes.reduce((acc, p) => acc + (p.monit.latency || 0), 0) / totalApps;
      const avgRequests = processes.reduce((acc, p) => acc + (p.monit['http.pmeter.requests'] || 0), 0) / totalApps;
      const activeRequests = processes.reduce((acc, p) => acc + (p.monit['http.pmeter.active_requests'] || 0), 0);
      const eventLoopLatency = processes.reduce((acc, p) => acc + (p.monit['eventLoop.latency'] || 0), 0) / totalApps;

      resolve({
        totalApps,
        avgCPU: avgCPU.toFixed(2),
        avgMemory: (avgMemory / 1024 / 1024).toFixed(2) + " MB",
        avgLatency: avgLatency.toFixed(2) + " ms",
        avgRequests,
        activeRequests,
        eventLoopLatency: eventLoopLatency.toFixed(2) + " ms",
        processes
      });
    });
  });
};

const startProcess = (scriptPath, options = {}) => {
  return new Promise((resolve, reject) => {
    pm2.start(scriptPath, (err, proc) => {
      if (err) {
        return reject(err);
      }
      resolve(proc);
    });
  });
};

const stopProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.stop(processName, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ message: `Stopped PM2 process: ${processName}` });
    });
  });
};

const restartProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.restart(processName, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ message: `Restarted PM2 process: ${processName}` });
    });
  });
};

const deleteProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.delete(processName, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({ message: `Deleted PM2 process: ${processName}` });
    });
  });
};

const describeProcess = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.describe(processName, (err, description) => {
      if (err) {
        return reject(err);
      }
      resolve(description);
    });
  });
};

const getLogs = (processName) => {
  return new Promise((resolve, reject) => {
    pm2.describe(processName, (err, logs) => {
      if (err) {
        return reject(err);
      }
      resolve(logs);
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
