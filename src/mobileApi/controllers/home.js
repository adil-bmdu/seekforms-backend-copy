const JobPost = require("../../admin/Models/JobPost");
const EnteranceExam = require("../../admin/Models/enteranceExam");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const Applicant = require("../../mobileApi/models/applicant");

module.exports = {
  getHomeData: async (req, res) => {
    try {
      const govNum = await JobPost.countDocuments({
        jobSector: { $regex: new RegExp("Government", "i") },
      });
      const govAppplicant = await Applicant.countDocuments();
      const privateNum = await JobPost.countDocuments({
        jobSector: { $regex: new RegExp("Private", "i") },
      });
      const privateAppplicant = await Applicant.countDocuments();
      const examNum = await EnteranceExam.countDocuments();
      const examAppplicant = 0;
      const ignouNum = 0;
      const ignouAppplicant = 0;
      const counsellingNum = 0;
      const counsellingAppplicant = 0;
      const queryNum = 0;
      const queryAppplicant = 0;
      const data = [
        {
          name: "Govt. Jobs",
          newJobs: govNum,
          applied: govAppplicant,
        },
        {
          name: "Private Jobs",
          newJobs: privateNum,
          applied: privateAppplicant,
        },
        {
          name: "Ignou",
          newJobs: ignouNum,
          applied: ignouAppplicant,
        },
        {
          name: "Entrance Exams",
          newJobs: examNum,
          applied: examAppplicant,
        },
        {
          name: "Counselling",
          newJobs: counsellingNum,
          applied: counsellingAppplicant,
        },
        {
          name: "Query",
          newJobs: queryNum,
          applied: queryAppplicant,
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
