const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studyUserScoreSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  study: { type: Schema.Types.ObjectId, ref: "Study", required: true },
  score: { type: Number, default: 0 },
});

const StudyUserScore = mongoose.model("StudyUser", studyUserScoreSchema);
module.exports = StudyUserScore;
