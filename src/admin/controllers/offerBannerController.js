const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const OfferBanner = require("../Models/offerBanner");

module.exports = {
  createOfferBanner: async (req, res) => {
    try {
      const { image, title, description } = req.body;
      const offerBanner = new OfferBanner({ image, title, description });
      await offerBanner.save();
      return sendResponse(
        "Offer banner created successfully",
        res,
        constant.CODE.SUCCESS,
        offerBanner
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        "Internal server error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR
      );
    }
  },
  getOfferBanners: async (req, res) => {
    try {
      const offerBanners = await OfferBanner.find();
      return sendResponse(
        "Offer banners fetched successfully",
        res,
        constant.CODE.SUCCESS,
        offerBanners
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        "Internal server error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR
      );
    }
  },
  deleteOfferBanner: async (req, res) => {
    try {
      const { id } = req.params;
      await OfferBanner.findByIdAndDelete(id);
      return sendResponse(
        "Offer banner deleted successfully",
        res,
        constant.CODE.SUCCESS
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        "Internal server error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR
      );
    }
  },
};
