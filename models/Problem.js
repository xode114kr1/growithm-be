const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProblemSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: { type: String, enum: ["pending", "solved"], required: true },
    platform: { type: String, default: "" },
    categories: { type: [String] },
    timestamp: { type: String, default: "2000-01-01" },
    tier: { type: String, default: "" },
    title: { type: String, default: "" },
    problemId: { type: String, default: "" },
    link: { type: String, default: "" },
    memory: { type: String, default: "" },
    time: { type: String, default: "" },
    description: { type: String, default: "" },
    code: { type: String, default: "" },
    memo: { type: String },
  },
  {
    versionKey: false,
  }
);

const Problem = mongoose.model("Problem", ProblemSchema);
module.exports = Problem;
