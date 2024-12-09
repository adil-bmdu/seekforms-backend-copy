const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const Question = require("../Models/question");
const { options } = require("../routes/jobPost");

module.exports = {
  createQuestion: async (req, res) => {
    try {
      const {
        testType,
        testName,
        durationPerQuestion,
        markPerQuestion,
        questionType,
        question,
        correctAnswer,
        solution,
        ...option
      } = req.body;
      const isQuestionExist = await Question.findOne({ testType, testName });
      const options = Object.values(option);
      const questions = [
        { questionType, question, correctAnswer, options, solution },
      ];
      const data = {
        testType,
        testName,
        durationPerQuestion,
        markPerQuestion,
        questions,
      };
      if (!isQuestionExist) {
        const entry = new Question(data);
        await entry.save();
        return sendResponse(
          "Question created successfully",
          res,
          constant.CODE.SUCCESS,
          { data },
          200
        );
      } else {
        await Question.findOneAndUpdate(
          { testType, testName },
          { $addToSet: { questions: questions } }
        );
        const updatedEntry = await Question.findOne({ testType, testName });
        return sendResponse(
          "Question added successfully",
          res,
          constant.CODE.SUCCESS,
          { updatedEntry },
          200
        );
      }
    } catch (error) {
      return sendResponse(
        "Failed to create question",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  getQuestion: async (req, res) => {
    try {
      const type = req.query.testType;
      const questionType = req.query.questionType;
      const query = { testType: type };
      const question = await Question.find(query);
      const entry = question.map((item) => {
        const questionType = item.questions.map((item) => item.questionType);
        const uniqueQuestionType = [...new Set(questionType)];
        return {
          testId: item._id,
          testType: item.testType,
          testName: item.testName,
          duration: String(
            item.durationPerQuestion * item.questions.length
          ).trim(),
          totalMarks: `${item.markPerQuestion * item.questions.length} Marks`,
          totalQuestions: `${item.questions.length} Questions`,
          questionTypes: uniqueQuestionType,
          questions: item.questions.map((item) => {
            return {
              questionId: item.questionId,
              questionType: item.questionType,
              question: item.question,
              options: item.options,
            };
          }),
        };
      });
      const entryFilter = entry.map((item) => {
        if (questionType) {
          item.questions = item.questions.filter(
            (item) => item.questionType === questionType
          );
        }
        return {
          ...item,
          questions: item.questions.map((item) => {
            return {
              questionId: item.questionId,
              question: item.question,
              options: item.options,
            };
          }),
        };
      });
      return sendResponse(
        "Questions fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { questions: entryFilter },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to fetch questions",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findByIdAndDelete(id);
      return sendResponse(
        "Question deleted successfully",
        res,
        constant.CODE.SUCCESS,
        { data: question },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to delete question",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
};
