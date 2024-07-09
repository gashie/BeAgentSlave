const express = require("express");
const router = express.Router();
// const { userLogin } = require('../middleware/validator')
// const { protect } = require('../middleware/auth')
const {  CreateAdmin,ViewAdmimnUsers,UpdateAdminUser } = require("../controllers/system/user_management");
const { VerifyUser, Logout, UserAuth, VerifyCounter, CustomerAuth } = require("../controllers/account/auth");
const { protect, } = require("../middleware/auth");
const { AccountOpening, PushTransaction } = require("../controllers/customers/manage");

//routes

///admin management
router.route("/create_admin").post(CreateAdmin);
router.route("/view_admins").post(ViewAdmimnUsers);
router.route("/update_admin").post(UpdateAdminUser);


///customer management
router.route("/accountoepening").post(AccountOpening);
router.route("/pushtransaction").post(protect,PushTransaction);
//user login auth
router.route("/auth").post(protect, VerifyUser);
router.route("/user_login").post(CustomerAuth);
router.route("/logout").post(protect, Logout);
module.exports = router;
