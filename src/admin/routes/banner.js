const express = require("express");
const router = express.Router();
const authenticate = require("../../helper/jwtAuth");
const banner = require("../controllers/offerBannerController");

router.post("/create-banner", authenticate, banner.createOfferBanner);
router.get("/get-banners", authenticate, banner.getOfferBanners);
router.delete("/delete-banner/:id", authenticate, banner.deleteOfferBanner);

module.exports = router;
