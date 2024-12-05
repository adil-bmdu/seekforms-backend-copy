const JobPost = require("../Models/JobPost");
const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const { uploadToCloudinary } = require("../../helper/cloudinary");
const Applicant = require("../../mobileApi/models/applicant");
const indianStates = require("../../config/state");

module.exports = {
  createJobPost: async (req, res) => {
    try {
      const bodyData = { ...req.body };
      let result;
      if (req.file) {
        result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );
        if (result?.http_code == 400)
          return sendResponse(
            "error during upload file",
            res,
            constant.CODE.INPUT_VALIDATION,
            {},
            0
          );
        bodyData.companyLogo = result.secure_url;
      }
      const jobpost = new JobPost(bodyData);
      await jobpost.save();
      return sendResponse(
        "Job Create Successfully",
        res,
        constant.CODE.SUCCESS,
        { jobpost },
        1
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  updateJobPost: async (req, res) => {
    try {
      const { Id } = req.params;
      const bodyData = { ...req.body };
      let result;
      if (req.file) {
        result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );
        if (result?.http_code == 400)
          return sendResponse(
            "error during upload file",
            res,
            constant.CODE.INPUT_VALIDATION,
            {},
            0
          );
        bodyData.companyLogo = result.secure_url;
      }
      const jobpost = await JobPost.findByIdAndUpdate(Id, bodyData, {
        new: true,
      });
      if (!jobpost)
        sendResponse("Data not found", res, constant.CODE.NOT_FOUND, {}, 0);

      return sendResponse(
        "Update Job Successfully",
        res,
        constant.CODE.SUCCESS,
        { jobpost },
        1
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

  deleteJobPost: async (req, res) => {
    try {
      const { Id } = req.params;

      const jobpost = await JobPost.findByIdAndDelete(Id);
      if (!jobpost)
        return sendResponse(
          "Data not found",
          res,
          constant.CODE.NOT_FOUND,
          {},
          0
        );

      return sendResponse(
        "Job Delete Successfully",
        res,
        constant.CODE.SUCCESS,
        {},
        1
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

  getJobPostById: async (req, res) => {
    try {
      const { Id } = req.params;
      const jobpost = await JobPost.findById(Id);
      if (!jobpost)
        sendResponse("Data not found", res, constant.CODE.NOT_FOUND, {}, 0);

      return sendResponse(
        "Job Create Successfully",
        res,
        constant.CODE.SUCCESS,
        { jobpost },
        1
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
  getJobPostList: async (req, res) => {
    try {
      const search = req.query.search || "";
      const fromDate = req.query.fromDate || "";
      const toDate = req.query.toDate || "";
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const jobSector = req.query.jobSector || "";
      const query = {};

      if (search) {
        query.$or = [
          { jobTitle: { $regex: new RegExp(search, "i") } },
          { jobType: { $regex: new RegExp(search, "i") } },
          { categoryName: { $regex: new RegExp(search, "i") } },
          { subCategoryName: { $regex: new RegExp(search, "i") } },
          { jobType: { $regex: new RegExp(search, "i") } },
          { companyName: { $regex: new RegExp(search, "i") } },
          { city: { $regex: new RegExp(search, "i") } },
        ];
      }
      if (jobSector) query.jobSector = jobSector;
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        query.createdAt = {
          $gte: from,
          $lte: to,
        };
      }
      const total = await JobPost.countDocuments(query);

      const jobposts = await JobPost.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const response = {
        data: jobposts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalList: total,
      };

      return sendResponse(
        "Data fetched successfully",
        res,
        constant.CODE.SUCCESS,
        response,
        1
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  getJobPostForApp: async (req, res) => {
    try {
      const categoryName = req.query.categoryName || "";
      const subCategoryName = req.query.subCategoryName || "";
      const jobTitle = req.query.jobTitle || "";
      const qualification = req.query.qualification || "";
      const state = req.query.state || "";
      const location = req.query.location || "";
      const salary = req.query.salary || "";
      const query = {};

      query.jobSector = { $regex: new RegExp("private", "i") };
      const salaryRange = salary.split("-");

      if (categoryName)
        query.categoryName = { $regex: new RegExp(categoryName, "i") };
      if (subCategoryName)
        query.subCategoryName = { $regex: new RegExp(subCategoryName, "i") };
      if (jobTitle) query.jobTitle = { $regex: new RegExp(jobTitle, "i") };
      // mobileApi job filter
      if (qualification) query.qualification = qualification;
      if (state) {
        query.locality = { $regex: new RegExp(state, "i") };
      }
      if (location) {
        query.city = { $regex: new RegExp(location, "i") };
      }
      if (salary)
        query.$or = [
          { salary: { $regex: new RegExp(salaryRange[0], "i") } },
          { salary: { $regex: new RegExp(salaryRange[1], "i") } },
        ];
      // mobileApi job filter end
      const total = await JobPost.countDocuments(query);

      const userId = req.user._id;
      const jobpostId = await Applicant.find(
        { userId: userId, status: { $not: { $eq: "draft" } } },
        { jobpostId: 1, _id: 0 }
      );
      const draftId = await Applicant.find(
        { userId: userId, status: { $eq: "draft" } },
        { jobpostId: 1, _id: 0 }
      );
      const draft = JSON.parse(
        JSON.stringify(draftId.map((item) => item.jobpostId))
      );
      const jobId = JSON.parse(
        JSON.stringify(jobpostId.map((item) => item.jobpostId))
      );

      const jobposts = await JobPost.find(query).sort({ createdAt: -1 });

      const result = jobposts.filter(
        (item) => !jobId.includes(JSON.parse(JSON.stringify(item._id)))
      );

      const finalResult = result.map((item) => {
        item.isSaved = draft.includes(JSON.parse(JSON.stringify(item._id)))
          ? true
          : false;
        return item;
      });

      const response = {
        data: finalResult,
        totalList: finalResult.length,
      };

      return sendResponse(
        "Data fetched successfully",
        res,
        constant.CODE.SUCCESS,
        response,
        1
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  getJobForGovernment: async (req, res) => {
    try {
      const categoryName = req.query.categoryName || "";
      const subCategoryName = req.query.subCategoryName || "";
      const jobTitle = req.query.jobTitle || "";
      const qualification = req.query.qualification || "";
      const state = req.query.state || "";
      const location = req.query.location || "";
      const salary = req.query.salary || "";
      const query = {};

      query.jobSector = { $regex: new RegExp("government", "i") };
      const salaryRange = salary.split("-");

      if (categoryName) query.categoryName = categoryName;
      if (subCategoryName) query.subCategoryName = subCategoryName;
      if (jobTitle) query.jobTitle = { $regex: new RegExp(jobTitle, "i") };
      // mobileApi job filter
      if (qualification) query.qualification = qualification;
      if (state) {
        query.locality = { $regex: new RegExp(state, "i") };
      }
      if (location) {
        query.city = { $regex: new RegExp(location, "i") };
      }
      if (salary)
        query.$or = [
          { salary: { $regex: new RegExp(salaryRange[0], "i") } },
          { salary: { $regex: new RegExp(salaryRange[1], "i") } },
        ];
      // mobileApi job filter end
      const total = await JobPost.countDocuments(query);

      const userId = req.user._id;
      const jobpostId = await Applicant.find(
        { userId: userId, status: { $not: { $eq: "draft" } } },
        { jobpostId: 1, _id: 0 }
      );

      const draftId = await Applicant.find(
        { userId: userId, status: { $eq: "draft" } },
        { jobpostId: 1, _id: 0 }
      );
      const draft = JSON.parse(
        JSON.stringify(draftId.map((item) => item.jobpostId))
      );

      const jobId = JSON.parse(
        JSON.stringify(jobpostId.map((item) => item.jobpostId))
      );

      const jobposts = await JobPost.find(query).sort({ createdAt: -1 });

      const result = jobposts.filter(
        (item) => !jobId.includes(JSON.parse(JSON.stringify(item._id)))
      );

      const finalResult = result.map((item) => {
        item.isSaved = draft.includes(JSON.parse(JSON.stringify(item._id)))
          ? true
          : false;
        return item;
      });

      const response = {
        data: finalResult,
        totalList: finalResult.length,
      };

      return sendResponse(
        "Data fetched successfully",
        res,
        constant.CODE.SUCCESS,
        response,
        1
      );
    } catch (error) {
      console.error(error);
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },
  getFilterData: async (req, res) => {
    try {
      const jobSector = req.query.jobSector;
      const query = {};
      if (jobSector) {
        query.jobSector = { $regex: new RegExp(jobSector, "i") };
      }
      const salary = await JobPost.find(query, {
        salary: 1,
        _id: 0,
      });
      const salaryList = salary.map((item) => item.salary);
      const finalSalary = [
        ...salaryList,
        "10,000-20,000",
        "20,000-30,000",
        "30,000-40,000",
        "40,000-50,000",
      ];
      const uniqueSalaryList = finalSalary.filter(
        (item, index, self) => self.indexOf(item) === index
      );
      const qualification = await JobPost.find(query, {
        qualification: 1,
        _id: 0,
      });
      const qualificationList = qualification.map((item) => item.qualification);
      const qualificationChat = [
        "10th",
        "12th",
        "Diploma",
        "Bachelor's",
        "Master's",
        "PhD",
        "Graduate",
        "Post Graduate",
        "B.Tech",
        "B.E",
        "B.com",
        ...qualificationList,
      ];
      const uniqueQualification = qualificationChat.filter(
        (item, index, self) => self.indexOf(item) === index
      );

      const data = {
        salary: uniqueSalaryList.sort(),
        qualification: uniqueQualification,
        indianStates,
      };
      const result = {
        data,
        totalList: data.length,
      };
      return sendResponse(
        "Data fetched successfully",
        res,
        constant.CODE.SUCCESS,
        result,
        1
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
