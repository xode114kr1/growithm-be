const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PendingProblemSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: String },
  tier: { type: String },
  title: { type: String },
  problemId: { type: String },
  link: { type: String },
  memory: { type: String },
  time: { type: String },
  description: { type: String },
  code: { type: String },
});

const PendingProblem = mongoose.model("PendingProblem", PendingProblemSchema);
module.exports = PendingProblem;
