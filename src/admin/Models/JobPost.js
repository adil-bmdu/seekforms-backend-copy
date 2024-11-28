const mongoose = require("mongoose");
const jobPostSchema = new mongoose.Schema(
  {
    jobSector: {
      type: String,
      require: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    subCategoryName: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: null,
    },
    qualification: {
      type: String,
      default: null,
    },
    experience: {
      type: String,
      default: null,
    },
    skills: {
      type: String,
      default: null,
    },
    salary: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    locality: {
      type: String,
      default: null,
    },
    numberOfOpening: {
      type: String,
      default: null,
    },
    workingHours: {
      type: String,
      default: null,
    },
    workingDays: {
      type: String,
      default: null,
    },
    contactPerson: {
      type: String,
      default: null,
    },
    contactNumber: {
      type: String,
      default: null,
    },
    interviewAddress: {
      type: String,
      default: null,
    },
    aboutCompany: {
      type: String,
      default: null,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", jobPostSchema);
