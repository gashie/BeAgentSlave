const os = require('os');
module.exports = {
    formatMemorySize: (bytes) => {
        const kilobytes = bytes / 1024;
        const megabytes = kilobytes / 1024;
        const gigabytes = megabytes / 1024;

        if (gigabytes > 1) {
            return `${gigabytes.toFixed(2)} GB`;
        } else if (megabytes > 1) {
            return `${megabytes.toFixed(2)} MB`;
        } else {
            return `${kilobytes.toFixed(2)} KB`;
        }
    },
    formatLoadAverages: () => {
        return os.loadavg().map(avg => avg.toFixed(2));
    },
     formatDiskLatency:(diskLatency)=> {
        if (diskLatency < 1000) {
            return `${diskLatency.toFixed(2)} ms`;
        } else if (diskLatency < 60000) {
            return `${(diskLatency / 1000).toFixed(2)} seconds`;
        } else {
            return `${(diskLatency / 60000).toFixed(2)} minutes`;
        }
    },
     formatBytes : (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
    },
     formatUptime : (uptimeInSeconds) => {
        const days = Math.floor(uptimeInSeconds / (3600 * 24));
        const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = uptimeInSeconds % 60;
    
        const uptimeParts = [];
        if (days > 0) uptimeParts.push(`${days} days`);
        if (hours > 0) uptimeParts.push(`${hours} hours`);
        if (minutes > 0) uptimeParts.push(`${minutes} minutes`);
        if (seconds > 0) uptimeParts.push(`${seconds} seconds`);
    
        return uptimeParts.join(', ') || '0 seconds';
    },
     convertKeysToUnderscore:(obj)=> {
        if (obj && typeof obj === 'object') {
            if (Array.isArray(obj)) {
                // If the object is an array, recursively process each element
                return obj.map((item) => convertKeysToUnderscore(item));
            } else {
                // If the object is a non-array object, process its keys
                const newObj = {};
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        // Convert the key to underscore_case
                        const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                        // Recursively process the value
                        newObj[newKey] = convertKeysToUnderscore(obj[key]);
                    }
                }
                return newObj;
            }
        } else {
            // If the input is not an object, return it as is
            return obj;
        }
    },
    
    // Example usage:
    
}