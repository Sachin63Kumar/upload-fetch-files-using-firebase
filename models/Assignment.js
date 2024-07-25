const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  fileUrl: { type: String, required: true },
  deadline: { type: Date, required: true },
  marks: { type: Number, required: true },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
