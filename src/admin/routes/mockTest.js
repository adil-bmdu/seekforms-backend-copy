const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const upload = require("../../helper/fileUpload");
const mockTest = require("../controllers/mockTestListController");
const question = require("../controllers/questionController");

router.post(
  "/create-mock-test",
  upload.single("imgFile"),
  authenticate,
  mockTest.createMockTest
);
router.get("/get-test-list", authenticate, mockTest.getTestList);
router.delete("/delete-test-list/:id", authenticate, mockTest.deleteTestList);
router.get("/get-questions", authenticate, question.getQuestion);
router.post("/create-question", authenticate, question.createQuestion);
router.delete("/delete-question/:id", authenticate, question.deleteQuestion);
router.get("/get-all-questions", authenticate, question.getAllQuestions);

module.exports = router;
