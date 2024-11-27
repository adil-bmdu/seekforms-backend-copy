const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const admissionForm = new Schema(
  {
    degreeType: {
      type: String,
      required: true,
    },
    data: [
      {
        program: {
          type: String,
          required: true,
          required: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
        },
        college: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        totalFee: {
          type: String,
          required: true,
        },
        eligibility: {
          type: String,
          required: true,
        },
        platformFee: {
          type: Number,
          required: true,
        },
        ageLimit: {
          type: String,
          required: true,
        },
        documents: {
          type: String,
          required: true,
        },
        imgUrl: {
          type: String,
          required: true,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdmissionForm", admissionForm);
