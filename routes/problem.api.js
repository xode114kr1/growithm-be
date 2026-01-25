const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problem.controller");
const authController = require("../controllers/auth.controller");
const scoreController = require("../controllers/score.controller");
const { startTx, endTx } = require("../middlewares/transaction");

router.get(
  "/",
  authController.optionalRefresh,
  authController.findUserByToken,
  problemController.getProblemList
);

router.get("/list/:userId", problemController.getProblemListByUserId);

router.get(
  "/tier-stats",
  authController.optionalRefresh,
  authController.findUserByToken,
  problemController.getProblemTierStats
);

router.get("/:id", problemController.getProblemById);

router.patch(
  "/solved/:id",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  scoreController.addScore,
  problemController.saveSolvedProblem,
  endTx
);

router.patch(
  "/edit/:id/",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  problemController.saveSolvedProblem,
  endTx
);

router.post("/share", startTx, problemController.shareProblemToStudys, endTx);
router.get("/info/:userId", problemController.getProblemInfo);

module.exports = router;
