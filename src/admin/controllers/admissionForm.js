const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const AdmissionForm = require("../Models/admissionForm");

module.exports = {
  createForm: async (req, res) => {
    try {
      const {
        degreeType,
        program,
        fieldOfStudy,
        college,
        location,
        totalFee,
        eligibility,
        platformFee,
        ageLimit,
        documents,
        imgUrl,
      } = req.body;
      const data = {
        program,
        fieldOfStudy,
        college,
        location,
        totalFee,
        eligibility,
        platformFee,
        ageLimit,
        documents,
        imgUrl,
      };
      const response = {
        degreeType,
        data,
      };
      const isDegreeTypeExist = await AdmissionForm.findOne({ degreeType });
      if (!isDegreeTypeExist) {
        const admissionForm = new AdmissionForm(response);
        await admissionForm.save();
      } else {
        const admissionForm = await AdmissionForm.findOneAndUpdate({
          $push: { data },
        });
      }
      return sendResponse(
        "Admission form created successfully",
        res,
        constant.CODE.SUCCESS,
        { response },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to create admission form",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  getForms: async (req, res) => {
    try {
      const data = await AdmissionForm.find();
      return sendResponse(
        "Admission form fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { data },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to fetch admission form",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
};
