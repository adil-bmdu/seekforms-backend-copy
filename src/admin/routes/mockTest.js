const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const mockTest = require("../controllers/mockTestListController");

router.post("/create-mock-test", authenticate, mockTest.createMockTest);
router.get("/get-test-list", authenticate, mockTest.getTestList);
router.delete("/delete-test-list/:id", authenticate, mockTest.deleteTestList);

module.exports = router;
