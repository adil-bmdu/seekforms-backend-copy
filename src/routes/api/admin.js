const express = require("express");
const router = express.Router();
const adminAuth = require("../../admin/routes/auth");
const jobPost = require("../../admin/routes/jobPost");
const interviewVideo = require("../../admin/routes/interviewVideo");
const user = require("../../admin/routes/user");
const admissionForm = require("../../admin/routes/ignou");
const exam = require("../../admin/routes/exam");

router.use("/auth", adminAuth);
router.use("/jobpost", jobPost);
router.use("/videos", interviewVideo);
router.use("/user", user);
router.use("/ignou", admissionForm);
router.use("/exam", exam);

module.exports = router;
