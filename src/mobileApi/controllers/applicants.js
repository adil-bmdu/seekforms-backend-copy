const Applicant = require("../models/applicant");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const mongoose = require("mongoose");

module.exports = {
  postApplicant: async (req, res) => {
    const { _id } = req.user;
    const { jobpostId: postId } = req.body;
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).send({ error: "Invalid userId format." });
    }
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).send({ error: "Invalid userId format." });
    }
    try {
      const userId = new mongoose.Types.ObjectId(_id);
      const jobpostId = new mongoose.Types.ObjectId(postId);

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

      // Create a new applicant if not found
      const applicant = new Applicant({ userId, jobpostId });
      await applicant.save();

      return sendResponse(
        "Applicant posted successfully",
        res,
        constant.CODE.SUCCESS,
        { applicant },
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
    const { _id } = req.user;
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).send({ error: "Invalid userId format." });
    }
    const userId = new mongoose.Types.ObjectId(_id);
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
};
