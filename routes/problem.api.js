const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problem.controller");
const authController = require("../controllers/auth.controller");
const scoreController = require("../controllers/score.controller");
const { startTx, endTx } = require("../middlewares/transaction");

// 내 문제 조회
router.get(
  "/me",
  authController.optionalRefresh,
  authController.findUserByToken,
  problemController.getProblemList,
);

// 특정 유저의 문제 조회
router.get("/users/:userId", problemController.getProblemListByUserId);

// 내 문제의 티어 통계 조회
router.get(
  "/me/tier-stats",
  authController.optionalRefresh,
  authController.findUserByToken,
  problemController.getProblemTierStats,
);

// 특정 문제 조회
router.get("/:problemId", problemController.getProblemById);

// 특정 문제 메모 작성
router.patch(
  "/:problemId/write",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  scoreController.addScore,
  problemController.saveSolvedProblem,
  endTx,
);

// 특정 문제 메모 수정
router.patch(
  "/:problemId/edit",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  problemController.saveSolvedProblem,
  endTx,
);

// 특정 문제 스터디에 공유
router.patch(
  "/:problemId/share",
  startTx,
  problemController.shareProblemToStudys,
  endTx,
);

module.exports = router;
