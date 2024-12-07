const JobPost = require("../../admin/Models/JobPost");
const EnteranceExam = require("../../admin/Models/enteranceExam");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const Applicant = require("../../mobileApi/models/applicant");

module.exports = {
  getHomeData: async (req, res) => {
    try {
      const userId = req.user._id;
      //code for government jobs
      const gov = await JobPost.find(
        {
          jobSector: { $regex: new RegExp("Government", "i") },
        },
        { _id: 1 }
      );
      const govNum = gov.length;
      const govApp = await Applicant.find(
        { userId: userId, status: { $not: { $eq: "draft" } } },
        { jobpostId: 1, _id: 0 }
      );
      const govId = gov.map((item) => JSON.stringify(item._id));
      const govAppId = govApp.map((item) => JSON.stringify(item.jobpostId));
      const govAppNum = govAppId.filter((item) => govId.includes(item)).length;
      const govAppDraft = await Applicant.find(
        { userId: userId, status: "draft" },
        { jobpostId: 1, _id: 0 }
      );
      const govAppDraftId = govAppDraft.map((item) =>
        JSON.stringify(item.jobpostId)
      );
      const govAppDraftNum = govAppDraftId.filter((item) =>
        govId.includes(item)
      ).length;
      const govRejected = 0;
      //code for private jobs
      const private = await JobPost.find(
        {
          jobSector: { $regex: new RegExp("Private", "i") },
        },
        { _id: 1 }
      );
      const privateNum = private.length;
      const privateApplicant = await Applicant.find(
        { userId: userId, status: { $not: { $eq: "draft" } } },
        { jobpostId: 1, _id: 0 }
      );
      const privateId = private.map((item) => JSON.stringify(item._id));
      const privateAppId = privateApplicant.map((item) =>
        JSON.stringify(item.jobpostId)
      );
      const privateAppNum = privateAppId.filter((item) =>
        privateId.includes(item)
      ).length;
      const privateAppDraft = await Applicant.find(
        { userId: userId, status: "draft" },
        { jobpostId: 1, _id: 0 }
      );
      const privateAppDraftId = privateAppDraft.map((item) =>
        JSON.stringify(item.jobpostId)
      );
      const privateAppDraftNum = privateAppDraftId.filter((item) =>
        privateId.includes(item)
      ).length;
      const privateRejected = 0;
      //code for exam
      const examNum = await EnteranceExam.countDocuments();
      const examApplicant = 0;
      const ignouNum = 0;
      const ignouApplicant = 0;
      const counsellingNum = 0;
      const counsellingApplicant = 0;
      const queryNum = 0;
      const queryApplicant = 0;
      const data = [
        {
          name: "Govt. Jobs",
          newJobs: govNum,
          applied: govAppNum,
          rejected: govRejected,
          draft: govAppDraftNum,
        },
        {
          name: "Private Jobs",
          newJobs: privateNum,
          applied: privateAppNum,
          rejected: privateRejected,
          draft: privateAppDraftNum,
        },
        {
          name: "IGNOU",
          newJobs: ignouNum,
          applied: ignouApplicant,
        },
        {
          name: "Counselling",
          newJobs: counsellingNum,
          applied: counsellingApplicant,
        },
        {
          name: "Entrance Exams",
          newJobs: examNum,
          applied: examApplicant,
        },
        {
          name: "Get Queries",
          newJobs: queryNum,
          applied: queryApplicant,
        },
      ];
      return sendResponse(
        "Home data fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { data: data },
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
