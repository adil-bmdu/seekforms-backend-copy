const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const Counsellor = require("../Models/counsellor");

module.exports = {
  createCounsellor: async (req, res) => {
    try {
      const { imgUrl, message, pdfName, pdfUrl } = req.body;
      const pdfDetails = { pdfName, pdfUrl };
      const data = { imgUrl, message, pdfDetails };
      const counsellor = new Counsellor(data);
      await counsellor.save();
      return sendResponse(
        "Counsellor created successfully",
        res,
        constant.CODE.SUCCESS,
        { data },
        200
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        "Failed to create counsellor",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  getAllCounsellors: async (req, res) => {
    try {
      const counsellors = await Counsellor.find();
      return sendResponse(
        "Counsellors fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { counsellors },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to fetch counsellors",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
};
