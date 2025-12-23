const express = require("express");
const router = express.Router();
const { requireStudyOwner } = require("../middlewares/authorization");

const authController = require("../controllers/auth.controller");
const studyController = require("../controllers/study.controller");

router.get("/", authController.findUserByToken, studyController.getStudyList);
router.get("/user-score/:studyId", studyController.getStudyUserScoreById);
router.get("/:studyId", studyController.getStudyById);
router.post("/", authController.findUserByToken, studyController.createStudy);
router.delete(
  "/:studyId",
  authController.findUserByToken,
  requireStudyOwner,
  studyController.deleteStudyById
);

module.exports = router;
