const express = require("express");

const authApi = require("./auth.api");
const userApi = require("./user.api");
const githubApi = require("./github.api");

const router = express.Router();

router.use("/github", githubApi);
router.use("/auth", authApi);
router.use("/user", userApi);

module.exports = router;
