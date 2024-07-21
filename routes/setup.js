const express = require("express");
const router = express.Router();

const {  CreateAdmin,ViewAdmimnUsers,UpdateAdminUser, MonitorServices } = require("../controllers/systemctl/manage");
const { ManagePm2 } = require("../controllers/pm2/manage");

//routes

///admin management
router.route("/pm2").post(ManagePm2);
router.route("/ctl").get(MonitorServices);
module.exports = router;
