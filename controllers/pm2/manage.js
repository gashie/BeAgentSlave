const pm2 = require('pm2');
const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const { startProcess,listProcesses,stopProcess } = require('../../helper/pm2');
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
            res.json({ message: `Started PM2 process: ${processName}` });
            break;
          case 'stop':
            await stopProcess(processName);
            res.json({ message: `Stopped PM2 process: ${processName}` });
            break;
          case 'list':
            const processes = await listProcesses();
            res.json({ processes });
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