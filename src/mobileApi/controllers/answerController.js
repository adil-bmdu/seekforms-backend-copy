const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const Answer = require("../models/answer");

module.exports = {
  submitAnswer: async (req, res) => {
    const { _id: userId } = req.user;
    const { testId } = req.body;
    try {
      await Answer.findOneAndUpdate({ userId, testId }, { isSubmitted: true });
      return sendResponse(
        "Answer submitted successfully",
        res,
        constant.CODE.SUCCESS,
        {},
        200
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
  saveAnswer: async (req, res) => {
    const { _id: userId } = req.user;
    const { testId, questionId, answer } = req.body;
    try {
      const answers = {
        questionId,
        answer,
      };
      const data = {
        userId,
        testId,
        answers,
      };
      const isAnswerExists = await Answer.findOne({ userId, testId });
      const isSubmitted = await Answer.findOne({
        userId,
        testId,
        isSubmitted: true,
      });
      if (!isSubmitted) {
        if (isAnswerExists) {
          const isQuestionIdExists = await Answer.findOne({
            userId,
            testId,
            "answers.questionId": questionId,
          });
          if (isQuestionIdExists) {
            await Answer.findOneAndUpdate(
              {
                userId,
                testId,
                "answers.questionId": questionId,
              },
              {
                $set: { "answers.$.answer": answer },
              }
            );
            const updatedAnswer = await Answer.findOne({ userId, testId });
            return sendResponse(
              "Answer saved successfully",
              res,
              constant.CODE.SUCCESS,
              { answer: updatedAnswer },
              0
            );
          } else {
            await Answer.findOneAndUpdate(
              { userId, testId },
              { $addToSet: { answers } }
            );
            const updatedAnswer = await Answer.findOne({ userId, testId });
            return sendResponse(
              "Answer saved successfully",
              res,
              constant.CODE.SUCCESS,
              { answer: updatedAnswer },
              0
            );
          }
        } else {
          const answer = new Answer(data);
          await answer.save();
          return sendResponse(
            "Answer saved successfully",
            res,
            constant.CODE.SUCCESS,
            { answer },
            0
          );
        }
      }
      return sendResponse(
        "Answer already submitted",
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
