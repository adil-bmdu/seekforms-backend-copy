const express = require('express');
const router = express.Router();
const user = require("../../mobileApi/routes/user");
const complaint=require('../../mobileApi/routes/complaint');
const feedback=require('../../mobileApi/routes/feedback');

router.use("/", user);
router.use('/complaint',complaint);
router.use('/feedback',feedback);

module.exports = router;