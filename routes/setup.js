const express = require("express");
const router = express.Router();

const {  CreateAdmin,ViewAdmimnUsers,UpdateAdminUser, MonitorServices, ManageServices } = require("../controllers/systemctl/manage");
const { ManagePm2, MonitorPm2 } = require("../controllers/pm2/manage");
const { GetSysInfo } = require("../controllers/sysinfo/manage");

//routes

///admin management
router.route("/pm2").post(ManagePm2);
router.route("/ctl").post(ManageServices);
router.route("/ctlinfo").post(MonitorServices);
router.route("/sysinfo").post(GetSysInfo);
router.route("/ctlmonitor").post(MonitorServices);
router.route("/sysinfomonitor").post(GetSysInfo);
router.route("/pm2monitor").post(MonitorPm2);
module.exports = router;
