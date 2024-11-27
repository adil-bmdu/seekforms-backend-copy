const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const AdmissionForm = require("../Models/admissionForm");

module.exports = {
  createForm: async (req, res) => {
    try {
      const admissionForm = new AdmissionForm(req.body);
      await admissionForm.save();
      sendResponse(
        res,
        constant.CODE.SUCCESS,
        "Admission form created successfully",
        {},
        201
      );
    } catch (error) {
      sendResponse(
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        "Failed to create admission form",
        {},
        500
      );
    }
  },
};
