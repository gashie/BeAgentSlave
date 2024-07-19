const os = require('os');
const si = require('systeminformation');
const diskusage = require('diskusage');
const osu = require('os-utils');
const Speedometer = require('speedometer');
const macaddress = require('macaddress');
const { exec, execSync } = require('child_process');
const { formatBytes } = require('./autoformaters');

module.exports = {
    getNetworkUsage: () => {
        return new Promise((resolve, reject) => {
            const rxSpeedometer = new Speedometer();
            const txSpeedometer = new Speedometer();

            let totalRxBytes = 0;
            let totalTxBytes = 0;

            exec('netstat -s', (err, stdout) => {
                if (err) {
                    console.error('Error retrieving network statistics:', err);
                    reject(err);
                    return;
                }

                const lines = stdout.split('\n');
                const rxIndex = lines.findIndex(line => line.includes('packets received'));
                const txIndex = lines.findIndex(line => line.includes('packets sent'));

                const rx = rxIndex !== -1 ? parseInt(lines[rxIndex].split(' ')[0], 10) : 0;
                const tx = txIndex !== -1 ? parseInt(lines[txIndex].split(' ')[0], 10) : 0;

                const rxSpeed = rxSpeedometer(rx);
                const txSpeed = txSpeedometer(tx);

                // Accumulate total bytes transferred
                totalRxBytes += rxSpeed;
                totalTxBytes += txSpeed;

                // Resolve the promise with the network usage data
                resolve({
                    totalRxBytes,
                    totalTxBytes,
                    rxSpeed,
                    txSpeed
                });
            });
        });
    },
    getDiskUsage: async () => {
        return new Promise((resolve, reject) => {
            // Determine the root path based on the OS
            const rootPath = os.platform() === 'win32' ? 'C:' : '/';

            diskusage.check(rootPath, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
    },

    getHostDetails: () => {
        const hostname = os.hostname();
        const platform = os.platform();
        const arch = os.arch();
        const cpus = os.cpus();
        const totalMemoryGB = (os.totalmem() / (1024 ** 3)).toFixed(2); // Convert to gigabytes
        const freeMemoryGB = (os.freemem() / (1024 ** 3)).toFixed(2); // Convert to gigabytes
        const uptime = os.uptime();
        const cpuModel = cpus[0].model;
        const numOfCores = cpus.length;
        const version = os.version();
        const type = os.type();
        const userInfo = os.userInfo();
        const machine = os.machine();
        const release = os.release()
        const networkInterfaces = os.networkInterfaces()
        return {
            hostname, platform, arch, cpus, totalMemoryGB, freeMemoryGB, uptime, cpuModel, numOfCores, version, type, userInfo, machine, release, networkInterfaces
        }
    },
    getPrimaryInterface: () => {
        try {
            // For Unix-like systems, use the route command to find the default interface

            if (os.platform() === 'linux' || os.platform() === 'darwin') {
                const defaultInterface = execSync('route get default | grep interface', { encoding: 'utf8' });
                return defaultInterface.split(' ')[1].trim();
            }

            // For Windows, use the route command to find the default interface
            if (os.platform() === 'win32') {
                const defaultInterface = execSync('route print | findstr /C:"0.0.0.0"', { encoding: 'utf8' });
                const lines = defaultInterface.split('\n');
                return lines[0].trim().split(/\s+/)[3];
            }
        } catch (error) {
            console.error('Error finding primary interface:', error);
        }

        return null;
    },
    getMacAddresses: () => {
        const networkInterfaces = os.networkInterfaces();
        const macAddresses = {};

        for (let interface in networkInterfaces) {
            if (networkInterfaces[interface][0].mac !== '00:00:00:00:00:00') {
                macAddresses[interface] = networkInterfaces[interface][0].mac;
            }
        }

        return macAddresses;
    },

    getMacAddress: () => {
        const getmac = require('getmac');
        return getmac.default();
    },
    getCpuUsage: async () => {
        return new Promise((resolve) => {
            osu.cpuUsage(resolve);
        });
    },
    getHostIPAddress: () => {
        const networkInterfaces = os.networkInterfaces();
        for (let interface in networkInterfaces) {
            for (let interfaceInfo of networkInterfaces[interface]) {
                if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
                    return interfaceInfo.address;
                }
            }
        }
        return 'IP Address not found';
    },
    getProcessInformation: async () => {
        try {
            const data = await si.processes();
            const processList = data.list.map(p => {
                return {
                    pid: p.pid,
                    parentPid: p.parentPid,
                    name: p.name,
                    cpu: p.cpu, // Since cpu is already a number, no need for toFixed
                    mem: p.mem.toFixed(1), // Format mem to 1 decimal place if needed
                    priority: p.priority,
                    memVsz: p.memVsz,
                    memRss: p.memRss,
                    nice: p.nice,
                    started: p.started,
                    state: p.state,
                    tty: p.tty,
                    user: p.user,
                    command: p.command,
                    params: p.params,
                    path: p.path
                };
            });
            return processList;
        } catch (error) {
            console.error('Error retrieving process information:', error);
            throw error;
        }
    },
    // get ip address
    getIpAddress: () => {
        const ifaces = os.networkInterfaces();
        for (const iface in ifaces) {
            const addresses = ifaces[iface];
            for (const addr of addresses) {
                if (addr.family === 'IPv4' && !addr.internal) {
                    return addr.address;
                }
            }
        }
        return 'Unknown';
    },
    // Get CPU serial number
    getCpuSerial: () => {
        const cpus = os.cpus();
        const serials = [];
        for (const cpu of cpus) {
            if (cpu.hasOwnProperty('serialNumber')) {
                serials.push(cpu.serialNumber);
            }
        }
        return serials.join(',');
    },

    // Get the motherboard serial number
    getMotherboardSerial: () => {
        return os.platform() === 'win32' ? os.userInfo().username : os.hostname();
    },
    // get MAC address
    getMac: () => {
        return new Promise((resolve, reject) => {
            macaddress.one((err, mac) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mac);
                }
            });
        });
    }

}