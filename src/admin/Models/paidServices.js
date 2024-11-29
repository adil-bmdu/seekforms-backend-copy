const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paidServices = new Schema(
  {
    serviceDiscount: {
      type: String,
      required: true,
    },
    discountMoney: {
      type: Number,
      required: true,
    },
    serviceMoney: {
      type: Number,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    nextServiceDetail: {
      type: String,
      required: true,
    },
    serviceDetails: [
      {
        detail: {
          type: String,
        },
      },
    ],
    formCount: {
      type: Number,
      required: true,
      default: 0,
    },
    admitCardCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaidServices", paidServices);
