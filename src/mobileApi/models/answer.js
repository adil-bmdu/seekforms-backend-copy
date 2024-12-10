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
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        answer: {
          type: Number,
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
