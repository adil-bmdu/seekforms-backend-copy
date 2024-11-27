const express = require("express");
const router = express.Router();
const userController = require("../../mobileApi/controllers/user");
const upload = require("../../helper/fileUpload");
const authentication = require("../../helper/jwtAuth");
const applicantController = require("../../mobileApi/controllers/applicants");

router.post("/register", userController.userRegister);

router.post("/login", userController.userLogin);

router.put("/change-password", authentication, userController.changePassword);

router.post("/forget-password", userController.forgetPassword);

router.put("/reset-password/:mobile", userController.resetPassword);

router.get("/profile", authentication, userController.profile);

router.put("/profile", authentication, userController.updateProfile);

router.get("/get-applicant", authentication, applicantController.getApplicant);
router.post(
  "/post-applicant",
  authentication,
  applicantController.postApplicant
);
router.post(
  "/draft-applicant",
  authentication,
  applicantController.draftApplicant
);
router.put(
  "/update-draft-applicant",
  authentication,
  applicantController.updateDraftApplication
);
router.delete(
  "/delete-draft-applicant",
  authentication,
  applicantController.deleteDraftApplication
);

module.exports = router;
