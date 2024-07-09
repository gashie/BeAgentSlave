const express = require("express");
const router = express.Router();

const {  CreateAdmin,ViewAdmimnUsers,UpdateAdminUser } = require("../controllers/systemctl/manage");
const { ManagePm2 } = require("../controllers/pm2/manage");

//routes

///admin management
router.route("/pm2").post(ManagePm2);
module.exports = router;
