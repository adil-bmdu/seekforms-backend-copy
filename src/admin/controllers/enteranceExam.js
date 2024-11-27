const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const EnteranceExam = require("../Models/enteranceExam");

module.exports = {
  createExam: async (req, res) => {
    try {
      const data = req.body;
      const exam = new EnteranceExam(data);
      await exam.save();
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
