const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const studyController = require("../controllers/study.controller");

router.get("/", authController.findUserByToken, studyController.getStudyList);
router.get("/:studyId", studyController.getStudyById);
router.post("/", authController.findUserByToken, studyController.createStudy);

module.exports = router;
