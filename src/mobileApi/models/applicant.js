const mongoose = require("mongoose");
const applicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobpostId: {
      type: mongoose.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "draft"],
      default: "applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applicant", applicantSchema);
