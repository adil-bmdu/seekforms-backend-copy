const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const Answer = require("../models/answer");

module.exports = {
  submitAnswer: async (req, res) => {
    const { _id: userId } = req.user;
    const { testId, answers } = req.body;
    try {
      const data = {
        userId,
        testId,
        answers,
      };
      return sendResponse(
        "You Have Sended Test Answer Successfully",
        res,
        constant.CODE.SUCCESS,
        { answer: data },
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
