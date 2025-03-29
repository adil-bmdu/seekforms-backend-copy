const Applicant = require("../../mobileApi/models/applicant");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");

module.exports = {
  getAllApplicants: async (req, res) => {
    try {
      const applicants = await Applicant.find()
        .populate("userId")
        .populate("jobpostId");
      return sendResponse(
        "Applicants fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { applicants },
        0
      );
    } catch (error) {
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },
  updateApplicantStatus: async (req, res) => {
    const { userId, jobpostId, permit } = req.body;
    try {
      const applicant = await Applicant.findOne({ userId, jobpostId });
      if (!applicant) {
        return sendResponse(
          "Applicant not found",
          res,
          constant.CODE.NOT_FOUND,
          {},
          0
        );
      }
      applicant.status = permit;
      await applicant.save();
      return sendResponse(
        "Applicant status updated successfully",
        res,
        constant.CODE.SUCCESS,
        {},
        0
      );
    } catch (error) {
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },
};
