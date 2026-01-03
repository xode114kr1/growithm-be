const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    githubId: { type: String, required: true, unique: true },
    repo: { type: String },
    githubAccessToken: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String },
    avatarUrl: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.githubAccessToken;

  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
