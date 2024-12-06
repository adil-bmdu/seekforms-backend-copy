const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const MockTestList = require("../Models/mockTestList");

module.exports = {
  createMockTest: async (req, res) => {
    try {
      const { testName, imgUrl, ...type } = req.body;
      const testType = Object.values(type);
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
        const updateData = { $addToSet: { testType } };
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
