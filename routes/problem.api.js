const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problem.controller");
const autoController = require("../controllers/auth.controller");

router.get(
  "/",
  autoController.findUserByToken,
  problemController.getProblemList
);

router.get("/:id", problemController.getProblemById);

router.patch(
  "/solved/:id",
  autoController.findUserByToken,
  problemController.saveSolvedProblem
);

module.exports = router;
