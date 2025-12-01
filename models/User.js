const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    githubId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
