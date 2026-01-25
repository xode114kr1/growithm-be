const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

// 새로 고침 시 access_token, user 재전송
router.get(
  "/refresh",
  authController.hasAccessToken,
  authController.optionalRefresh,
  authController.findUserByToken,
  authController.issueTokensAndRespond,
);

// 로그인
router.post(
  "/github",
  authController.exchangeToken,
  authController.findOrCreateUser,
  authController.issueTokensAndRespond,
);

// 로그아웃
router.post("/logout", userController.logout);

module.exports = router;
