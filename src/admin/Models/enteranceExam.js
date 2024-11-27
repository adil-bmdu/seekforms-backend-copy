const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enteranceExamSchema = new Schema(
  {
    catagory: {
      type: String,
      required: true,
    },
    examData: [
      {
        field: {
          type: String,
          required: true,
        },
        eligibility: {
          type: String,
          required: true,
        },
        document: {
          type: String,
          required: true,
        },
        examDate: {
          type: Date,
          default: null,
        },
        examTime: {
          type: String,
          default: null,
        },
        examDuration: {
          type: String,
          default: null,
        },
        examLocation: {
          type: String,
          default: null,
        },
        examInstructions: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EnteranceExam", enteranceExamSchema);
