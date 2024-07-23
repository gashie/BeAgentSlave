const fs = require('fs');
const path = require('path');
const { parseLine } = require('../utils/apacheLogParser');
const { parseErrorLine } = require('../utils/apacheErrorLogParser');

let logs = [];
let errorLogs = [];

function readLogs(logFilePath, logType = 'error') {
    return new Promise((resolve, reject) => {
        fs.access(logFilePath, fs.constants.R_OK, (err) => {
            if (err) {
                return reject(new Error(`Permission denied: Unable to read file ${logFilePath}`));
            }

            fs.readFile(logFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const lines = data.trim().split('\n');


                if (logType === 'access') {
                    logs = lines.map(line => parseLine(line));
                } else if (logType === 'error') {
                    errorLogs = lines.map(line => parseErrorLine(line));
                }
                
                resolve(logType === 'access' ? logs : errorLogs);
            });
        });
    });
}

function getLogs(filters) {
    return logs.filter(log => {
        let match = true;
        if (filters.ip) {
            match = match && log.ip === filters.ip;
        }
        if (filters.status_code) {
            match = match && log.status_code === filters.status_code;
        }
        if (filters.method) {
            match = match && log.method === filters.method;
        }
        if (filters.url) {
            match = match && log.url.includes(filters.url);
        }
        if (filters.startDate) {
            const logDate = new Date(log.timestamp);
            const startDate = new Date(filters.startDate);
            match = match && logDate >= startDate;
        }
        if (filters.endDate) {
            const logDate = new Date(log.timestamp);
            const endDate = new Date(filters.endDate);
            match = match && logDate <= endDate;
        }
        return match;
    });
}

function getErrorLogs(filters) {
    return errorLogs.filter(log => {
        let match = true;
        if (filters.clientIp) {
            match = match && log.clientIp === filters.clientIp;
        }
        if (filters.errorCode) {
            match = match && log.errorCode === filters.errorCode;
        }
        if (filters.module) {
            match = match && log.module === filters.module;
        }
        if (filters.severity) {
            match = match && log.severity === filters.severity;
        }
        if (filters.startDate) {
            const logDate = new Date(log.timestamp);
            const startDate = new Date(filters.startDate);
            match = match && logDate >= startDate;
        }
        if (filters.endDate) {
            const logDate = new Date(log.timestamp);
            const endDate = new Date(filters.endDate);
            match = match && logDate <= endDate;
        }
        return match;
    });
}

module.exports = {
    readLogs,
    getLogs,
    getErrorLogs
};
