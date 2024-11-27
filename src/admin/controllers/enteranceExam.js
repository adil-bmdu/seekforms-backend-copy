const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const EnteranceExam = require("../Models/enteranceExam");

module.exports = {
  createExam: async (req, res) => {
    try {
      const {
        catagory,
        field,
        eligibility,
        document,
        examDate,
        examTime,
        examDuration,
        examLocation,
        examInstructions,
      } = req.body;
      const data = {
        field,
        eligibility,
        document,
        examDate,
        examTime,
        examDuration,
        examLocation,
        examInstructions,
      };
      const response = {
        catagory,
        data,
      };
      const isCatagoryExist = await EnteranceExam.findOne({ catagory });
      if (!isCatagoryExist) {
        const exam = new EnteranceExam(response);
        await exam.save();
      } else {
        const exam = await EnteranceExam.findOneAndUpdate(
          { catagory },
          { $push: { data } }
        );
      }
      return sendResponse(
        "Enterance exam created successfully",
        res,
        constant.CODE.SUCCESS,
        { data },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to create enterance exam",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  getAllExam: async (req, res) => {
    try {
      const exams = await EnteranceExam.find();
      return sendResponse(
        "Enterance exams fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { exams },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to fetch enterance exams",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
};
