const axios = require("axios");
const User = require("../models/User");

const {
  parseBaekjoonReadme,
  parseProgrammersReadme,
} = require("../utils/parsing");
const Problem = require("../models/Problem");

const flatformMap = { 백준: "beakjoon", 프로그래머스: "programmers" };

const githubController = {};

githubController.webhookChaining = async (req, res) => {
  const { owner, repo } = req.body;
  if (!owner | !repo) {
    return res.status(400).json({ message: "repoFullName is required" });
  }

  const user = req.user;

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

  if (!githubRes) {
    return res.status(400).json({ message: "Fail to chaining webhook" });
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

githubController.savePendingData = async (req, res) => {
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
    return res.status(400).json({ error: "Cannot find platform" });
  }

  newPending.code = code;
  newPending.timestamp = timestamp;
  newPending.state = "pending";
  newPending.platform = platform;

  const user = await User.findOne({ githubId: githubSenderId });

  if (!user) {
    return res
      .status(401)
      .json({ message: "GitHub access token not found for this user" });
  }

  newPending.userId = user._id;
  await Problem.create(newPending);
};

module.exports = githubController;
