const pm2 = require('pm2');
const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const { startProcess,listProcesses,stopProcess,getLogs,restartProcess,deleteProcess,describeProcess } = require('../../helper/pm2');
const { getServerMetrics } = require('../../helper/metrics');
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.ManagePm2 = asynHandler(async (req, res, next) => {
// Initialize PM2
const { action, processName } = req.body;
pm2.connect(async(err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    try {


        switch (action) {
            case 'start':
              await startProcess(processName);
            //   ws.send(JSON.stringify({ message: `Started PM2 process: ${processName}` }));
              return sendResponse(res, 1, 200, `Started PM2 process: ${processName}`, []);
              break;
            case 'stop':
              await stopProcess(processName);
            //   ws.send(JSON.stringify({ message: `Stopped PM2 process: ${processName}` }));
              return sendResponse(res, 1, 200, `Stopped PM2 process: ${processName}`, []);
            case 'list':
              const processes = await listProcesses();
            //   ws.send(JSON.stringify({ processes }));
            // let metrics = await getServerMetrics()
              return sendResponse(res, 1, 200, `Process list retrieved`, [{processes}]);

              break;
            case 'restart':
              await restartProcess(processName);
              return sendResponse(res, 1, 200, `Restarted PM2 process: ${processName}`, []);
            //   ws.send(JSON.stringify({ message: `Restarted PM2 process: ${processName}` }));
              break;
            case 'delete':
              await deleteProcess(processName);
              return sendResponse(res, 1, 200, `Deleted PM2 process: ${processName}`, []);
            //   ws.send(JSON.stringify({ message: `Deleted PM2 process: ${processName}` }));
              break;
            case 'describe':
              const description = await describeProcess(processName);
            //   ws.send(JSON.stringify({ description }));
              return sendResponse(res, 1, 200, `Process description`, description);

              break;
            case 'logs':
              const logs = await getLogs(processName);
            //   ws.send(JSON.stringify({ logs }));
            const logFilePath = logs[0].pm2_env.pm_out_log_path;
            res.sendFile(logFilePath);
            //   return sendResponse(res, 1, 200, `Process description`, logs);

              break;
            default:
                res.status(400).json({ error: 'Invalid action' });
            }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to perform PM2 action' });
      }
})
})
exports.MonitorPm2 = asynHandler(async (req, res, next) => {
  // Initialize PM2
  pm2.connect(async(err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
  
      try {
  
        const processes = await listProcesses();
          return sendResponse(res, 1, 200, `Process list retrieved`, processes);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to perform PM2 action' });
        }
  })
  })