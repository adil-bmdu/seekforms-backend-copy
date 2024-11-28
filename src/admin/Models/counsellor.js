const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counsellorSchema = new Schema({
  imgUrl: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    required: true,
  },
  pdfDetails: {
    type: {
      pdfName: {
        type: String,
        required: true,
      },
      pdfUrl: {
        type: String,
        default: null,
      },
    },
    required: true,
  },
});

module.exports = mongoose.model("Counsellor", counsellorSchema);
