const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testType: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  durationPerQuestion: {
    type: Number,
    required: true,
  },
  markPerQuestion: {
    type: Number,
    required: true,
  },
  questions: [
    {
      _id: false,
      questionId: {
        type: mongoose.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      questionType: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      correctAnswer: {
        type: Number,
        required: true,
      },
      solution: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);
