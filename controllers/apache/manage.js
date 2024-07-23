const logModel = require('../../model/logModel');
const path = require('path');
async function fetchLogs(req, res) {
    try {
        const filters = {
            ip: req.query.ip,
            status: req.query.status,
            method: req.query.method,
            url: req.query.url,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };
        console.log('Fetching logs with filters:', filters);
        const logs = await logModel.getLogs(filters);
        console.log('Fetched logs:', logs);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: error.message });
    }
}

async function loadLogs(req, res) {
    const logFilePath = path.resolve(req.body.path);

    // Determine log type dynamically based on the file path or other criteria
    const logType = logFilePath.includes('access') ? 'access' : 'error';

    try {
        let logs = await logModel.readLogs(logFilePath, logType);
        res.status(200).json({ message: 'Logs loaded successfully', logs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    fetchLogs,
    loadLogs
};
