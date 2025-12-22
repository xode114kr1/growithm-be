const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problem.controller");
const autoController = require("../controllers/auth.controller");
const scoreController = require("../controllers/score.controller");
const { startTx, endTx } = require("../middlewares/transaction");

router.get(
  "/",
  autoController.findUserByToken,
  problemController.getProblemList
);

router.get("/list/:userId", problemController.getProblemListByUserId);

router.get("/:id", problemController.getProblemById);

router.patch(
  "/solved/:id",
  autoController.findUserByToken,
  startTx,
  scoreController.addScore,
  problemController.saveSolvedProblem,
  endTx
);

router.patch(
  "/edit/:id/",
  autoController.findUserByToken,
  startTx,
  problemController.saveSolvedProblem,
  endTx
);

router.post("/share", problemController.shareProblemToStudys);

module.exports = router;
