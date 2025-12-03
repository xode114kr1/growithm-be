const axios = require("axios");
const User = require("../models/User");
const PendingProblem = require("../models/PendingProblem");

const { parseBaekjoonReadme } = require("../utils/parsing");

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
      url: `${process.env.BACKEND_LOCAL_URL}/github/webhook/receiver`,
      content_type: "json",
    },
  };

  const githubRes = await axios.post(githubApiUrl, payload, {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  return res.status(201).json({ message: "Webhook created" });
};

githubController.webhookReceive = async (req, res, next) => {
  const payload = req.body;
  const repoFullName = payload.repository?.full_name;
  const commitSha = payload.after;
  const githubSenderId = payload.sender?.id;

  req.repoFullName = repoFullName;
  req.githubSenderId = githubSenderId;
  req.commitSha = commitSha;
  req.pathList = payload?.head_commit.added;
  next();
};

githubController.savePendingData = async (req, res) => {
  const repoFullName = req.repoFullName;
  const githubSenderId = req.githubSenderId;
  const commitSha = req.commitSha;
  const pathList = req.pathList;

  const baseUrl = `https://raw.githubusercontent.com/${repoFullName}/${commitSha}/`;
  const { data: readmd } = await axios.get(baseUrl + pathList[0]);
  const { data: code } = await axios.get(baseUrl + pathList[1]);
  const newPending = parseBaekjoonReadme(readmd);
  delete newPending.categories;
  newPending.code = code;

  console.log("[1]", githubSenderId);

  const user = await User.findOne({ githubId: githubSenderId });

  console.log("[2]", user);
  if (!user) {
    return res
      .status(401)
      .json({ message: "GitHub access token not found for this user" });
  }

  newPending.userId = user._id;
  await PendingProblem.create(newPending);
};

module.exports = githubController;
