const bcrypt = require("bcrypt");
const asynHandler = require("../../middleware/async");
const Model = require("../../model/Account")
const { sendResponse, sendCookie, clearResponse, CatchHistory,sendCustomerCookie } = require("../../helper/utilfunc");
const { Update, Finder } = require("../../model/Global");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

// @desc Login controller
// @route POST /auth
// @access Public
exports.CustomerAuth = asynHandler(async (req, res) => {
    const { username, password } = req.body

    //search for user in db
    const foundUser = await Model.tellerAuthModel(username)
    let UserDbInfo = foundUser.rows[0]

    if (!UserDbInfo) {
        CatchHistory({ api_response: "Unauthorized access-username not in database", function_name: 'UserAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')

    }


  
    //check for password
    const match = await bcrypt.compare(password, UserDbInfo.password)

    if (!match) {
        CatchHistory({ api_response: "Unauthorized access-user exist but password does not match", function_name: 'UserAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

 let UserInfo = {
        user_id: UserDbInfo.id,
        username: UserDbInfo.username,
        email: UserDbInfo.email,

    }






    CatchHistory({ api_response: "User logged in", function_name: 'UserAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
    return sendCustomerCookie(UserInfo, 1, 200, res, req)
})
exports.SysAdminAuth = asynHandler(async (req, res) => {
    const { username, password } = req.body

    //search for user in db
    const foundUser = await Model.adminAuthModel(username)
    let UserDbInfo = foundUser.rows[0]

    if (!UserDbInfo) {
        CatchHistory({ api_response: "Unauthorized access-username not in database", function_name: 'SysAdminAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')

    }


    //is user active ?
    if (!UserDbInfo.is_active) {
        CatchHistory({ api_response: "Unauthorized access-user exist but not active", function_name: 'SysAdminAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //is user verified ?
    if (!UserDbInfo.is_verified) {
        CatchHistory({ api_response: "Unauthorized access-user exist but not verified", function_name: 'SysAdminAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //check for password
    const match = await bcrypt.compare(password, UserDbInfo.password)

    if (!match) {
        CatchHistory({ api_response: "Unauthorized access-user exist but password does not match", function_name: 'SysAdminAuth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //find role for this user
    const findRole = await Model.findUserRoleModel(UserDbInfo.user_id)
    let UserRole = findRole.rows[0]

    const findRolePermissions = await Model.findUserPermissionModel(UserDbInfo.user_id)
    let UserRolePermissions = findRolePermissions.rows

    let UserInfo = {
        user_id: UserDbInfo.user_id,
        username: UserDbInfo.username,
        first_name: UserDbInfo.first_name,
        last_name: UserDbInfo.last_name,
        email: UserDbInfo.email,
        phone: UserDbInfo.phone,
        role: UserRole,
        permissions: UserRolePermissions

    }
    Update({ last_login: systemDate }, 'users', 'user_id', UserInfo.user_id)



    CatchHistory({ api_response: "User logged in", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "USER AUTHENTICATION", actor: username }, req)
    return sendCookie(UserInfo, 1, 200, res, req)
})


exports.VerifyUser = asynHandler(async (req, res, next) => {
    let userData = req.user;
    CatchHistory({ api_response: "User is verified", function_name: 'VerifyUser', date_started: systemDate, sql_action: "SELECT", event: "VERIFY USER TOKEN", actor: userData.id }, req)

    return sendResponse(res, 1, 200, "Loggedin", userData)
});

exports.VerifyCounter = asynHandler(async (req, res, next) => {
    let counterData = req.counter_info;
    CatchHistory({ api_response: "User is verified", function_name: 'VerifyUser', date_started: systemDate, sql_action: "SELECT", event: "VERIFY USER TOKEN", actor: counterData.id }, req)

    return sendResponse(res, 1, 200, "Loggedin", counterData)
});


exports.Logout = asynHandler(async (req, res, next) => {
    CatchHistory({ api_response: "User is logged out", function_name: 'Logout', date_started: systemDate, sql_action: "SELECT", event: "Logout", actor: req.user.id }, req)
    return clearResponse(req, res)
});