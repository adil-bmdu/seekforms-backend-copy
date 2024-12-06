const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testType: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  markPerQuestion: {
    type: Number,
    required: true,
  },
  questions: [
    {
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
        select: false,
      },
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);
