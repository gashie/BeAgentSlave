const parseErrorLine = (line) => {
    console.log(`Parsing line: ${line}`); // Debug log

    const logRegex = /^\[([^\]]+)\] \[([^\]]+):([^\]]+)\] \[pid (\d+):tid (\d+)\] \[client ([^:]+):(\d+)\] ([A-Z]+\d+): (.+)$/;
    const match = logRegex.exec(line);

    if (!match) {
        console.log(`No match found for line: ${line}`); // Debug log
        return { event: 'error', message: 'Log line format not recognized', line };
    }

    const [
        fullMatch,
        timestamp,
        module,
        severity,
        pid,
        tid,
        clientIp,
        clientPort,
        errorCode,
        errorMessage
    ] = match;

    return {
        event: 'error',
        timestamp: new Date(timestamp).getTime(),
        module,
        severity,
        pid,
        tid,
        clientIp,
        clientPort,
        errorCode,
        errorMessage
    };
};

module.exports = {
    parseErrorLine
}