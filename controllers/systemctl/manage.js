
const asyncHandler = require("../../middleware/async");
const path = require("path")
const fs = require("fs")
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const { status } = require("../../helper/ctl");



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




