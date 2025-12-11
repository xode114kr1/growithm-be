const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const studyRequestController = require("../controllers/studyRequest.controller");

router.get(
  "/",
  authController.findUserByToken,
  studyRequestController.getStudyRequestList
);

module.exports = router;
