const parseLine = (line) => {
    const logRegex = /(\S+) (\S+) (\S+) \[([^\]]+)\] "([^"]*)" (\d{3}) (\d+) "([^"]*)" "([^"]*)"/;
    const match = logRegex.exec(line);

    if (!match) {
        return { event: 'error', message: 'Log line format not recognized', line };
    }

    const [
        fullMatch,
        ip,
        identd,
        authuser,
        timestamp,
        request_line,
        status_code,
        bytes_sent,
        referer,
        user_agent
    ] = match;

    const [method, url, version] = request_line.split(' ');

    return {
        event: 'access',
        ip,
        identd,
        authuser,
        timestamp: new Date(timestamp).getTime(),
        method,
        url,
        version,
        status_code,
        bytes_sent,
        referer,
        user_agent
    };
};

module.exports = {
    parseLine
};
