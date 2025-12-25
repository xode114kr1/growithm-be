const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studyRequestSchema = Schema({
  studyId: { type: Schema.Types.ObjectId, ref: "Study", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  state: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

studyRequestSchema.index({ studyId: 1, userId: 1 }, { unique: true });

const StudyRequest = mongoose.model("StudyRequest", studyRequestSchema);
module.exports = StudyRequest;
