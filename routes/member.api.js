const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");

router.delete("/owner", memberController.deleteStudyMemberById);

module.exports = router;
