const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const Answer = require("../models/answer");

module.exports = {
  submitAnswer: async (req, res) => {
    const { _id: userId } = req.user;
    const { testId, answers: answer } = req.body;
    const answers = typeof answer === "string" ? JSON.parse(answer) : answer;
    const type = typeof answers;
    try {
      const data = {
        userId,
        testId,
        answers,
        type,
      };
      // const isSubmitted = await Answer.findOne({ userId, testId });
      // if (!isSubmitted) {
      //   const answer = new Answer(data);
      //   await answer.save();
      //   return sendResponse(
      //     "Answer submitted successfully",
      //     res,
      //     constant.CODE.SUCCESS,
      //     { answer },
      //     0
      //   );
      // }
      return sendResponse(
        "Answer already submitted",
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
