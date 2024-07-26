const axios = require('axios');
const asyncHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");



exports.MonitorServices = asyncHandler(async (req, res, next) => {

    const username = 'calpay';
    const password = 'calpay';
    const rabbitmqUrl = 'http://192.168.0.137:15672/api/exchanges';

    axios.get(rabbitmqUrl, {
        auth: {
            username: username,
            password: password
        }
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data from RabbitMQ:', error);
        });
});