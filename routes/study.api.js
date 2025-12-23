const express = require("express");
const router = express.Router();

const { startTx, endTx } = require("../middlewares/transaction");
const { requireStudyOwner } = require("../middlewares/authorization");

const authController = require("../controllers/auth.controller");
const studyController = require("../controllers/study.controller");
const memberController = require("../controllers/member.controller");
const studyRequestController = require("../controllers/studyRequest.controller");

router.get("/", authController.findUserByToken, studyController.getStudyList);
router.get("/user-score/:studyId", studyController.getStudyUserScoreById);
router.get("/:studyId", studyController.getStudyById);
router.post(
  "/",
  authController.findUserByToken,
  startTx,
  studyController.createStudy,
  endTx
);

// owner가 study-request를 보내는 기능
router.post(
  "/:studyId/send",
  authController.findUserByToken,
  requireStudyOwner,
  startTx,
  studyRequestController.sendStudyRequest,
  endTx
);

// owner가 study를 삭제하는 기능
router.delete(
  "/:studyId",
  authController.findUserByToken,
  requireStudyOwner,
  studyController.deleteStudyById
);

// owner가 study member를 삭제하는 기능
router.delete(
  "/:studyId/member/:memberId",
  authController.findUserByToken,
  requireStudyOwner,
  startTx,
  memberController.kickStudyMemberById,
  endTx
);

module.exports = router;
