const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Answer", answerSchema);
