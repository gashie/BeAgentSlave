
const asyncHandler = require("../../middleware/async");
const path = require("path")
const fs = require("fs")
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const { status, stop, start } = require("../../helper/ctl");



exports.MonitorServices = asyncHandler(async (req, res, next) => {
    try {
        // Read the services.json file
        const servicesFilePath = path.join(__dirname, '../../config/services.json');
        const servicesData = await fs.readFileSync(servicesFilePath);
        const services = JSON.parse(servicesData);

        // Array to hold the status results
        const results = [];

        // Check the status of each service
        for (const service of services) {
            const serviceStatus = await status(service.service);
            results.push({
                id: service.id,
                service: service.service,
                status: serviceStatus
            });
        }

        // Send the results in the response
        return sendResponse(res, 1, 200, 'Services list retrieved', results);
    } catch (error) {
        next(error);
    }
});
exports.ManageServices = asyncHandler(async (req, res, next) => {
    // Initialize PM2
    const { action, processName } = req.body;
    try {
    
    
        switch (action) {
            case 'stop':
              await stop(processName)
              return sendResponse(res, 1, 200, `Stopped Ctl process: ${processName}`, []);
            case 'status':
              const serviceStatus =   await status(processName)
              return sendResponse(res, 1, 200, `Ctl status retrieved`, serviceStatus);
            case 'start':
              await start(processName);
              return sendResponse(res, 1, 200, `Restarted Ctl process: ${processName}`, []);
            default:
                res.status(400).json({ error: 'Invalid action' });
            }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to perform PM2 action' });
      }
    })



