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
      const answer = new Answer(data);
      await answer.save();
      return sendResponse(
        "Answer submitted successfully",
        res,
        constant.CODE.SUCCESS,
        { answer },
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
