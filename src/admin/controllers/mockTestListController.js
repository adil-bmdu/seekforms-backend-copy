const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const MockTestList = require("../Models/mockTestList");
const { uploadToCloudinary } = require("../../helper/cloudinary");

module.exports = {
  createMockTest: async (req, res) => {
    try {
      const { testName, testType: testTypeString } = req.body;
      const testType = testTypeString.split(",").map((item) => item.trim());
      let imgUrl = "";
      if (req.file) {
        result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );
        if (result?.http_code == 400)
          return sendResponse(
            "error during upload file",
            res,
            constant.CODE.INPUT_VALIDATION,
            {},
            0
          );
        imgUrl = result.secure_url;
      }
      const isTestExist = await MockTestList.findOne({ testName });
      if (!isTestExist) {
        const mockTest = new MockTestList({
          testName,
          imgUrl,
          testType,
        });
        await mockTest.save();
        return sendResponse(
          "Mock test created successfully",
          res,
          constant.CODE.SUCCESS,
          { data: mockTest },
          200
        );
      } else {
        const updateData = { $set: { testType } };
        if (imgUrl) {
          updateData.$set = { imgUrl };
        }

        const mockTest = await MockTestList.findOneAndUpdate(
          { testName },
          updateData,
          { new: true }
        );
        return sendResponse(
          "Mock test created successfully",
          res,
          constant.CODE.SUCCESS,
          { data: mockTest },
          200
        );
      }
    } catch (error) {
      return sendResponse(
        "Something went wrong",
        res,
        constant.CODE.ERROR,
        {},
        500
      );
    }
  },
  getTestList: async (req, res) => {
    try {
      const testList = await MockTestList.find();
      return sendResponse(
        "Mock test list fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { data: testList },
        200
      );
    } catch (error) {
      return sendResponse(
        "Something went wrong",
        res,
        constant.CODE.ERROR,
        {},
        500
      );
    }
  },
  deleteTestList: async (req, res) => {
    try {
      const id = req.params.id;
      const testList = await MockTestList.findByIdAndDelete(id);
      return sendResponse(
        "Mock test list deleted successfully",
        res,
        constant.CODE.SUCCESS,
        { data: testList },
        200
      );
    } catch (error) {
      return sendResponse(
        "Something went wrong",
        res,
        constant.CODE.ERROR,
        {},
        500
      );
    }
  },
};
