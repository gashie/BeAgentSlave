const geoip = require('geoip-lite');

function lookup(ip) {
    return geoip.lookup(ip);
}

module.exports = {
    lookup
};
