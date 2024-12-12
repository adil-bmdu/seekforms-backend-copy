const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const Answer = require("../models/answer");
const Question = require("../../admin/Models/question");

module.exports = {
  submitAnswer: async (req, res) => {
    const { _id: userId } = req.user;
    const { testId, answers: answer } = req.body;
    const answers = JSON.parse(answer);
    try {
      const data = {
        userId,
        testId,
        answers,
      };
      const answer = new Answer(data);
      await answer.save();
      //preview {score{marks = marks/totalMarks}, rank{makrs/totalUserMaskrs}, Percentage, correctAnswer, incorrectAnswer, unattemptedQuestions}
      const allQuestions = await Question.findOne({ _id: testId });
      const questions = allQuestions.questions;
      const unattemptedQuestions = questions.filter(
        (question) =>
          !answers.find(
            (answer) =>
              JSON.stringify(answer.questionId) ===
              JSON.stringify(question.questionId)
          )
      );
      const correctAnswer = answers.filter((answer) => {
        const question = questions.find(
          (question) =>
            JSON.stringify(question.questionId) ===
            JSON.stringify(answer.questionId)
        );
        return question.correctAnswer === Number(answer.answer);
      });
      const incorrectAnswer = answers.filter((answer) => {
        const question = questions.find(
          (question) =>
            JSON.stringify(question.questionId) ===
            JSON.stringify(answer.questionId)
        );
        return question.correctAnswer !== Number(answer.answer);
      });
      const perQuestionMarks = allQuestions.markPerQuestion;
      const totalMarks = allQuestions.questions.length * perQuestionMarks;
      const preview = {
        srore: `${correctAnswer.length * perQuestionMarks}/${totalMarks}`,
        rank: "1/200",
        percentage:
          ((correctAnswer.length * perQuestionMarks) / totalMarks) * 100,
        correctAnswer: correctAnswer.length,
        incorrectAnswer: incorrectAnswer.length,
        unattemptedQuestions: unattemptedQuestions.length,
      };
      return sendResponse(
        "Answer submitted successfully",
        res,
        constant.CODE.SUCCESS,
        { preview },
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
