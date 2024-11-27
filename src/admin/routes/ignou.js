const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const admitionForm = require("../controllers/admissionForm");

router.post("/create-form", authenticate, admitionForm.createForm);
router.get("/get-forms", authenticate, admitionForm.getForms);

module.exports = router;
