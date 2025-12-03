const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authController = {};

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

authController.exchangeToken = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "code is required" });
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
      return res.status(400).json({
        message: "Failed to get GitHub access token",
        debug: tokenResponse.data,
      });
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
    res.status(400).json({ status: "fail login", error: error.message });
  }
};

authController.findOrCreateUser = async (req, res, next) => {
  try {
    const githubUser = req.githubUser;
    const githubAccessToken = req.githubAccessToken;

    // Todo : githubAccessToken 암호화 (bycryptjs 사용 예정)
    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        githubAccessToken: githubAccessToken,
      });
    } else {
      user.githubAccessToken = githubAccessToken;
      await user.save();
    }

    req.user = {
      _id: user._id,
      githubId: githubUser.id,
      name: githubUser.name || githubUser.login,
      avatarUrl: githubUser.avatar_url,
    };
    console.log(githubUser.avatar_url);
    next();
  } catch (error) {
    res.status(400).json({ status: "fail login", error: error.message });
  }
};

authController.issueTokensAndRespond = (req, res) => {
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
    secure: false,
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.json({
    message: "github login success",
    user,
  });
};

module.exports = authController;
