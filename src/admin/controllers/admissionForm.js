const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const AdmissionForm = require("../Models/admissionForm");

module.exports = {
  createForm: async (req, res) => {
    try {
      const data = req.body;
      const admissionForm = new AdmissionForm(data);
      await admissionForm.save();
      return sendResponse(
        "Admission form created successfully",
        res,
        constant.CODE.SUCCESS,
        { data },
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
