const Applicant = require("../models/applicant");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");

module.exports = {
  postApplicant: async (req, res) => {
    const { _id: userId } = req.user;
    const { jobpostId } = req.body;
    try {
      // Check if the applicant already exists
      const isApplicantExist = await Applicant.findOne({
        userId,
        jobpostId,
      }).populate("jobpostId");

      if (isApplicantExist) {
        return res
          .status(400)
          .send({ error: "Already applied", data: isApplicantExist });
      }
      const data = {
        userId: userId,
        jobpostId: jobpostId,
      };

      // Create a new applicant if not found
      const applicant = new Applicant(data);
      await applicant.save();

      return sendResponse(
        "Applicant posted successfully",
        res,
        constant.CODE.SUCCESS,
        { data },
        0
      );
    } catch (error) {
      console.error(error); // Log error for debugging
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },
  draftApplicant: async (req, res) => {
    const { _id: userId } = req.user;
    const { jobpostId } = req.body;
    try {
      // Check if the applicant already exists
      const isApplicantExist = await Applicant.findOne({
        userId,
        jobpostId,
      }).populate("jobpostId");

      if (isApplicantExist) {
        return res
          .status(400)
          .send({ error: "Already applied", data: isApplicantExist });
      }
      const data = {
        userId: userId,
        jobpostId: jobpostId,
        status: "draft",
      };

      // Create a new applicant if not found
      const applicant = new Applicant(data);
      await applicant.save();

      return sendResponse(
        "Applicant posted successfully",
        res,
        constant.CODE.SUCCESS,
        { data },
        0
      );
    } catch (error) {
      console.error(error); // Log error for debugging
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },
  getApplicant: async (req, res) => {
    const { _id: userId } = req.user;
    try {
      const applicant = await Applicant.find({ userId }).populate("jobpostId");
      return sendResponse(
        "Applicant fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { applicant },
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
  updateDraftApplication: async (req, res) => {
    const { _id: userId } = req.user;
    const { jobpostId } = req.body;
    const status = "pending";
    try {
      const applicant = await Applicant.findOneAndUpdate(
        { userId, jobpostId },
        { status },
        { new: true }
      ).populate("jobpostId");

      if (!applicant) {
        return res.status(404).send({ error: "Applicant not found" });
      }

      return sendResponse(
        "Application updated successfully",
        res,
        constant.CODE.SUCCESS,
        { applicant },
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
  deleteDraftApplication: async (req, res) => {
    const { _id: userId } = req.user;
    const { jobpostId } = req.body;
    try {
      const applicant = await Applicant.findOneAndDelete({
        userId,
        jobpostId,
      });
      if (!applicant) {
        return res.status(404).send({ error: "Applicant not found" });
      }
      return sendResponse(
        "Application deleted successfully",
        res,
        constant.CODE.SUCCESS,
        { applicant },
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
