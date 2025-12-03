const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PendingProblemSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tier: { type: String },
    title: { type: String },
    problemId: { type: String },
    link: { type: String },
    memory: { type: String },
    time: { type: String },
    description: { type: String },
    code: { type: String },
  },
  {
    timestamps: true,
  }
);

const PendingProblem = mongoose.model("PendingProblem", PendingProblemSchema);
module.exports = PendingProblem;
