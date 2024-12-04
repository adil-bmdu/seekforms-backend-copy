const mongoose = require("mongoose");

const mockTestListSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  testType: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("MockTestList", mockTestListSchema);
