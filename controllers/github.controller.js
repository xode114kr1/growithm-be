const axios = require("axios");
const User = require("../models/User");

const githubController = {};

githubController.webhookChaining = async (req, res) => {
  const { repoFullName } = req.body;

  if (!repoFullName) {
    return res.status(400).json({ message: "repoFullName is required" });
  }

  let owner;
  let repo;

  [owner, repo] = repoFullName.split("/");
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(400)
      .json({ message: "GitHub access token not found for this user" });
  }

  const githubAccessToken = user.githubAccessToken;
  const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/hooks`;

  const payload = {
    name: "web",
    active: true,
    event: ["push", "pull_request"],
    config: {
      url: `${process.env.BACKEND_LOCAL_URL}/github/webhook`,
      content_type: "json",
      secret: "asd",
    },
  };

  const githubRes = await axios.post(githubApiUrl, payload, {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  console.log("aaa", githubRes);
  return res.status(201).json({ message: "Webhook created" });
};

module.exports = githubController;
