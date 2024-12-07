const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const answer = require("../controllers/answerController");

router.post("/submit-answer", authenticate, answer.submitAnswer);

module.exports = router;
