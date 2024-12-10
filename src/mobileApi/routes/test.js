const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const answer = require("../controllers/answerController");

router.post("/submit-answer", authenticate, answer.submitAnswer);
router.post("/save-answer", authenticate, answer.saveAnswer);

module.exports = router;
