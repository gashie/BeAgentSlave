const os = require('os');
const { formatMemorySize,formatBytes,formatDiskLatency,formatLoadAverages,formatUptime } = require('./autoformaters');
const { getProcessInformation,getCpuUsage,getDiskUsage,getHostDetails,getHostIPAddress,getMacAddress,getMacAddresses,getNetworkUsage,getPrimaryInterface } = require('./autometrics');

async function getServerMetrics() {
    const proc = await getProcessInformation()
    const ipAddress = getHostIPAddress();
    const totalMemory = formatMemorySize(os.totalmem());
    const usedMemory = formatMemorySize(os.totalmem() - os.freemem());
    const { rxSpeed, txSpeed, totalRxBytes, totalTxBytes } = await getNetworkUsage();
    const diskUsage = await getDiskUsage();
    const {hostname,arch,cpus,uptime,cpuModel,numOfCores} = getHostDetails();
    const diskLatency = 1000 / os.loadavg()[0]; // Disk latency in milliseconds
    const cpuUsage = await getCpuUsage();
    const metrics = {
        proc,
        ip:ipAddress,
        cpuUsage: `${cpuUsage.toFixed(2)}%`,
        LoadAverage: formatLoadAverages(),
        macs:getMacAddresses(),
        mac:getMacAddress(),
        cpuModel,
        numOfCores,
        Host: hostname, // Define based on your setup
        totalMemory,
        uptime: formatUptime(uptime),
        arch,
        // cpus,
        usedMemory,// Define how you track last activity
        Version: process.version, // Node.js version or define your application version
        DiskLatency: formatDiskLatency(diskLatency),
        diskUsage: {
            available: formatBytes(diskUsage.available),
            free: formatBytes(diskUsage.free),
            total: formatBytes(diskUsage.total),
        },
        network_usage: {
            rxSpeed,
            txSpeed,
            totalRxBytes: formatBytes(totalRxBytes),
            totalTxBytes: formatBytes(totalTxBytes),
        }, // Define based on your application needs
    };

    return metrics
    // osu.cpuUsage(function(cpuPercent) {
       
    // });
}
module.exports = { getServerMetrics };