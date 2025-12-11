const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const studyRequestController = require("../controllers/studyRequest.controller");

router.get(
  "/",
  authController.findUserByToken,
  studyRequestController.getStudyRequestList
);

router.post(
  "/:studyRequestId/accept",
  authController.findUserByToken,
  studyRequestController.acceptStudtRequest
);

module.exports = router;
