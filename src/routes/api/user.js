const express = require("express");
const router = express.Router();
const user = require("../../mobileApi/routes/user");
const complaint = require("../../mobileApi/routes/complaint");
const feedback = require("../../mobileApi/routes/feedback");
const test = require("../../mobileApi/routes/test");

router.use("/", user);
router.use("/complaint", complaint);
router.use("/feedback", feedback);
router.use("/test", test);

module.exports = router;
