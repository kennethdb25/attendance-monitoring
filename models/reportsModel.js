const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
});

const ReportModel = new mongoose.model("ReportInfo", ReportSchema);

module.exports = ReportModel;
