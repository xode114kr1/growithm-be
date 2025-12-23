const express = require("express");
const router = express.Router();
const { startTx, endTx } = require("../middlewares/transaction");

const authController = require("../controllers/auth.controller");
const studyRequestController = require("../controllers/studyRequest.controller");

router.get(
  "/",
  authController.findUserByToken,
  studyRequestController.getStudyRequestList
);

router.get("/send/:studyId", studyRequestController.getSendStudyRequest);

// router.post(
//   "/send",
//   authController.findUserByToken,
//   studyRequestController.sendStudyRequest
// );

router.post(
  "/:studyRequestId/accept",
  authController.findUserByToken,
  startTx,
  studyRequestController.acceptStudyRequest,
  endTx
);

router.delete(
  "/:studyRequestId/reject",
  studyRequestController.rejectStudyRequest
);

module.exports = router;
