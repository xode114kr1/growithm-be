const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { encryptToken } = require("../utils/tokenCrypto");

const authController = {};

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

authController.exchangeToken = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      const error = new Error("Code is required");
      error.status = 400;
      return next(error);
    }

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      const error = new Error("Failed to get GitHub access token");
      error.status = 400;
      return next(error);
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    req.githubUser = userResponse.data;
    req.githubAccessToken = accessToken;
    next();
  } catch (error) {
    return next(error);
  }
};

authController.findOrCreateUser = async (req, res, next) => {
  try {
    const githubUser = req.githubUser;
    const githubAccessToken = req.githubAccessToken;

    const encrypted = encryptToken(githubAccessToken);

    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        githubAccessToken: encrypted,
        name: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
    } else {
      user.githubAccessToken = encrypted;
      user.name = githubUser.name || githubUser.login;
      user.avatarUrl = githubUser.avatar_url;
      await user.save();
    }

    req.user = user;

    next();
  } catch (error) {
    return next(error);
  }
};

authController.issueTokensAndRespond = (req, res, next) => {
  const user = req.user;

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return res.json({
    message: "github login success",
    data: user,
  });
};

authController.findUserByToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId);
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authController;
