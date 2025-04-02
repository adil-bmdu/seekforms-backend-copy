const Applicant = require("../../mobileApi/models/applicant");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");

module.exports = {
  getAllApplicants: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const fromDate = req.query.fromDate || "";
    const toDate = req.query.toDate || "";
    const jobTitle = req.query.jobTitle || "";
    const categoryName = req.query.categoryName || "";
    const subCategoryName = req.query.subCategoryName || "";
    const status = req.query.status || "";

    const matchConditions = {};

    if (jobTitle) {
      matchConditions["jobpost.jobTitle"] = { $regex: jobTitle, $options: "i" };
    }
    if (subCategoryName) {
      matchConditions["jobpost.subCategoryName"] = {
        $regex: subCategoryName,
        $options: "i",
      };
    }
    if (categoryName) {
      matchConditions["jobpost.categoryName"] = {
        $regex: categoryName,
        $options: "i",
      };
    }
    if (search) {
      matchConditions["$or"] = [
        { "user.name": { $regex: search, $options: "i" } },
        { "user.cin_number": { $regex: search, $options: "i" } },
        { "jobpost.jobTitle": { $regex: search, $options: "i" } },
        { "jobpost.categoryName": { $regex: search, $options: "i" } },
        { "jobpost.subCategoryName": { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      matchConditions.createdAt = { $gte: from, $lte: to };
    }
    if (status) {
      matchConditions["status"] = status;
    }

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "jobposts",
          localField: "jobpostId",
          foreignField: "_id",
          as: "jobpost",
        },
      },
      { $unwind: "$jobpost" },
      {
        $project: {
          "user.password": 0,
          "user.__v": 0,
          "jobpost.jobSector": 0,
          "jobpost.companyName": 0,
          "jobpost.city": 0,
          "jobpost.locality": 0,
          "jobpost.interviewAddress": 0,
          "jobpost.aboutCompany": 0,
          "jobpost.contactPerson": 0,
          "jobpost.contactNumber": 0,
          "jobpost.companyLogo": 0,
          "jobpost.isSaved": 0,
          "jobpost.__v": 0,
        },
      },
      { $match: matchConditions },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    try {
      const applicants = await Applicant.aggregate(pipeline);
      const totalApplicants = applicants.length;

      return sendResponse(
        "Applicants fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { applicants, totalApplicants },
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
