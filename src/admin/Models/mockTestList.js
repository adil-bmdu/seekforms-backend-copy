const mongoose = require("mongoose");

const mockTestListSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
    default: null,
  },
  testType: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("MockTestList", mockTestListSchema);
