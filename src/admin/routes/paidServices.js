const authenticate = require("../../helper/jwtAuth");
const express = require("express");
const router = express.Router();
const paidServices = require("../controllers/paidServicesController");

router.post(
  "/create-paid-service",
  authenticate,
  paidServices.createPaidService
);
router.get("/get-paid-services", authenticate, paidServices.getAllPaidServices);
router.delete(
  "/delete-paid-service/:id",
  authenticate,
  paidServices.deletePaidService
);

module.exports = router;
