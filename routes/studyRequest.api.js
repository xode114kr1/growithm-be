const express = require("express");
const router = express.Router();
const { startTx, endTx } = require("../middlewares/transaction");

const authController = require("../controllers/auth.controller");
const studyRequestController = require("../controllers/studyRequest.controller");
const { requireStudyOwner } = require("../middlewares/authorization");

// 내가 받은 스터디 요청 조회
router.get(
  "/me/received",
  authController.optionalRefresh,
  authController.findUserByToken,
  studyRequestController.getStudyRequestList,
);

// 스터디 초대를 보내는 기능
router.post(
  "/studies/:studyId",
  authController.optionalRefresh,
  authController.findUserByToken,
  requireStudyOwner,
  startTx,
  studyRequestController.sendStudyRequest,
  endTx,
);

// 특정 스터디에서 보낸 요청 조회
router.get("/studies/:studyId", studyRequestController.getSendStudyRequest);

// router.post(
//   "/send",
//   authController.findUserByToken,
//   studyRequestController.sendStudyRequest
// );

// 스터디 요청 수락
router.patch(
  "/:studyRequestId/accept",
  authController.optionalRefresh,
  authController.findUserByToken,
  startTx,
  studyRequestController.acceptStudyRequest,
  endTx,
);

// 스터디 요청 거절
router.delete(
  "/:studyRequestId/reject",
  studyRequestController.rejectStudyRequest,
);

module.exports = router;
