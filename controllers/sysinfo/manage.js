const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const { getServerMetrics } = require('../../helper/metrics');

exports.GetSysInfo = asynHandler(async (req, res, next) => {
    let metrics = await getServerMetrics()
    return sendResponse(res, 1, 200, `Metrics information retrieved`, metrics);
})