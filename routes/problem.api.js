const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problem.controller");
const autoController = require("../controllers/auth.controller");
const scoreController = require("../controllers/score.controller");
const { startTx } = require("../middlewares/transaction");

router.get(
  "/",
  autoController.findUserByToken,
  problemController.getProblemList
);

router.get("/:id", problemController.getProblemById);

router.patch(
  "/solved/:id",
  autoController.findUserByToken,
  startTx,
  scoreController.addScore,
  problemController.saveSolvedProblem
);

router.patch(
  "/edit/:id/",
  autoController.findUserByToken,
  startTx,
  problemController.saveSolvedProblem
);

router.post("/share", problemController.shareProblemToStudys);

module.exports = router;
