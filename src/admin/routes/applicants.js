const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");

const applicants = require("../controllers/applicants");

router.get("/get-applicants", authenticate, applicants.getAllApplicants);
router.put(
  "/update-applicant-status",
  authenticate,
  applicants.updateApplicantStatus
);

module.exports = router;
