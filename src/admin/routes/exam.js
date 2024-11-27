const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const exam = require("../controllers/enteranceExam");

router.post("/create-exam", authenticate, exam.createExam);
router.get("/get-exams", authenticate, exam.getAllExam);

module.exports = router;
