const axios = require("axios");
const User = require("../models/User");

const {
  parseBaekjoonReadme,
  parseProgrammersReadme,
} = require("../utils/parsing");
const Problem = require("../models/Problem");
const { decryptToken } = require("../utils/tokenCrypto");

const flatformMap = { 백준: "beakjoon", 프로그래머스: "programmers" };

const githubController = {};

githubController.webhookChaining = async (req, res, next) => {
  const { owner, repo } = req.body;
  if (!owner | !repo) {
    const error = new Error("RepoFullName is required");
    error.status = 400;
    return next(error);
  }

  const user = req.user;

  const encrypted = user.githubAccessToken;
  const githubAccessToken = decryptToken(encrypted);
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

  if (!githubRes) {
    const error = new Error("Fail to chaining webhook");
    error.status = 400;
    return next(error);
  }

  user.repo = repo;
  await user.save();

  return res.status(201).json({ message: "Webhook created" });
};

githubController.webhookReceive = async (req, res, next) => {
  const payload = req.body;
  const timestamp = payload.head_commit?.timestamp?.slice(0, 10) || null;
  const repoFullName = payload.repository?.full_name;
  const commitSha = payload.after;
  const githubSenderId = payload.sender?.id;
  const pathList = payload?.head_commit.added;
  const platform = flatformMap[payload?.head_commit?.added[0].split("/")[0]];

  req.timestamp = timestamp;
  req.repoFullName = repoFullName;
  req.githubSenderId = githubSenderId;
  req.commitSha = commitSha;
  req.pathList = pathList;
  req.platform = platform;
  next();
};

githubController.savePendingData = async (req, res, next) => {
  const timestamp = req.timestamp;
  const repoFullName = req.repoFullName;
  const githubSenderId = req.githubSenderId;
  const commitSha = req.commitSha;
  const pathList = req.pathList;
  const platform = req.platform;

  const baseUrl = `https://raw.githubusercontent.com/${repoFullName}/${commitSha}/`;
  const readmePath = pathList.find((p) => p.toLowerCase().endsWith(".md"));
  const codePath = pathList.find((p) => !p.toLowerCase().endsWith(".md"));

  const [readmd, code] = await Promise.all([
    axios.get(baseUrl + readmePath).then((res) => res.data),
    axios.get(baseUrl + codePath).then((res) => res.data),
  ]);

  let newPending;
  if (platform == "beakjoon") {
    newPending = parseBaekjoonReadme(readmd);
  } else if (platform == "programmers") {
    newPending = parseProgrammersReadme(readmd);
  } else {
    const error = new Error("Platform not found");
    error.status = 404;
    return next(error);
  }

  newPending.code = code;
  newPending.timestamp = timestamp;
  newPending.state = "pending";
  newPending.platform = platform;

  const user = await User.findOne({ githubId: githubSenderId });

  if (!user) {
    const error = new Error("GitHub access token not found for this user");
    error.status = 404;
    return next(error);
  }

  newPending.userId = user._id;
  await Problem.create(newPending);
};

module.exports = githubController;
