const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.AccountOpening = asynHandler(async (req, res, next) => {

    let payload = req.body


    //generate hashed password
    const salt = await bcyrpt.genSalt(10);
    payload.password = await bcyrpt.hash(payload.password, salt);

    //save user details to db
    let user_account = await GlobalModel.Create(payload, 'users', '');

    if (user_account.rowCount == 1) {
        return sendResponse(res, 1, 200, "You have successfully signed up to the platform", [])
    } else {
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])
    }


})

exports.PushTransaction = asynHandler(async (req, res, next) => {
    let userData = req.customer;
    /**
 * @returns {Object} - Object containing role details.
 */
    let payload = req.body;
    payload.user_id = userData.user_id
    let results = await GlobalModel.Create(payload, 'transactions', '');
    if (results.rowCount == 1) {
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})