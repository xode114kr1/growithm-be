const axios = require("axios");

const authController = {};

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

authController.login = async (req, res) => {
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

    const githubUser = userResponse.data;

    return res.status(200).json({
      message: "github login success",
      user: githubUser,
      // token,
      // userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ status: "fail login", error: error.message });
  }
};

module.exports = authController;
