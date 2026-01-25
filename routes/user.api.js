const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const problemController = require("../controllers/problem.controller");

// 이름으로 특정 유저 정보 조회
router.get("/", userController.getUserByName);

// 특정 유저의 문제 정보 조회
router.get("/:userId/problem-info", problemController.getProblemInfo);

module.exports = router;
