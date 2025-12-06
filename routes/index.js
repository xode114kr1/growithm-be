const express = require("express");

const authApi = require("./auth.api");
const userApi = require("./user.api");
const githubApi = require("./github.api");
const problemApi = require("./problem.api");

const router = express.Router();

router.use("/github", githubApi);
router.use("/auth", authApi);
router.use("/user", userApi);
router.use("/problem", problemApi);

module.exports = router;
