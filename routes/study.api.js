const express = require("express");
const router = express.Router();

const { startTx, endTx } = require("../middlewares/transaction");
const { requireStudyOwner } = require("../middlewares/authorization");

const authController = require("../controllers/auth.controller");
const studyController = require("../controllers/study.controller");
const memberController = require("../controllers/member.controller");
const studyRequestController = require("../controllers/studyRequest.controller");

// 내 스터디 목록 조회
router.get(
  "/me",
  authController.optionalRefresh,
  authController.findUserByToken,
  studyController.getStudyList,
);

// 스터디-유저 점수 조회
router.get("/:studyId/user-score", studyController.getStudyUserScoreById);

// 특정 스터디 조회
router.get("/:studyId", studyController.getStudyById);

// 스터디 생성
router.post(
  "/",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  studyController.createStudy,
  endTx,
);

// owner가 study-request를 보내는 기능
router.post(
  "/:studyId/send",
  authController.optionalRefresh,
  authController.findUserByToken,
  requireStudyOwner,
  startTx,
  studyRequestController.sendStudyRequest,
  endTx,
);

// 특정 스터디 삭제
router.delete(
  "/:studyId",
  authController.optionalRefresh,
  authController.findUserByToken,
  requireStudyOwner,
  studyController.deleteStudyById,
);

// 스터디 탈퇴
router.delete(
  "/:studyId/members/me",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  studyController.leaveStudy,
  endTx,
);

// 스터디 맴버 퇴출
router.delete(
  "/:studyId/members/:memberId",
  authController.optionalRefresh,
  authController.findUserByToken,
  requireStudyOwner,
  startTx,
  memberController.kickStudyMemberById,
  endTx,
);

module.exports = router;
