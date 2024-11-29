const constant = require("../../config/constant");
const { sendResponse } = require("../../config/helper");
const PaidServices = require("../Models/paidServices");

module.exports = {
  createPaidService: async (req, res) => {
    try {
      const {
        serviceDiscount,
        discountMoney,
        serviceMoney,
        serviceName,
        nextServiceDetail,
        formCount,
        admitCardCount,
        ...detail
      } = req.body;
      const serviceDetails = Object.entries(detail).map(([key, value]) => ({
        detail: value,
      }));
      const data = {
        serviceDiscount,
        discountMoney,
        serviceMoney,
        serviceName,
        nextServiceDetail,
        serviceDetails,
        formCount,
        admitCardCount,
      };
      const result = {
        data,
      };
      const paidService = new PaidServices(data);
      await paidService.save();
      return sendResponse(
        "Paid service created successfully",
        res,
        constant.CODE.SUCCESS,
        { result },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to create paid service",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  getAllPaidServices: async (req, res) => {
    try {
      const paidServices = await PaidServices.find();
      return sendResponse(
        "Paid services fetched successfully",
        res,
        constant.CODE.SUCCESS,
        paidServices,
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to fetch paid services",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
  deletePaidService: async (req, res) => {
    try {
      const { id } = req.params;
      const paidService = await PaidServices.findByIdAndDelete(id);
      return sendResponse(
        "Paid service deleted successfully",
        res,
        constant.CODE.SUCCESS,
        { paidService },
        200
      );
    } catch (error) {
      return sendResponse(
        "Failed to delete paid service",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        500
      );
    }
  },
};
