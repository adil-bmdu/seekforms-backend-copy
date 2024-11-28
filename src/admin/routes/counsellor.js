const authenticate = require("../../helper/jwtAuth");
const express = require("express");
const router = express.Router();
const counsellor = require("../controllers/counsellorController");

router.post("/create-counsellor", authenticate, counsellor.createCounsellor);
router.get("/get-counsellors", authenticate, counsellor.getAllCounsellors);

module.exports = router;
