const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studySchema = Schema(
  {
    title: { type: String, required: true },
    explanation: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true }
);

const Study = mongoose.model("Study", studySchema);
module.exports = Study;
