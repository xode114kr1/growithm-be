const Problem = require("../models/Problem");
const Study = require("../models/Study");
const StudyUserScore = require("../models/StudyUserScore");
const { exchangeStudyScore } = require("../utils/score");

const problemController = {};

problemController.getProblemList = async (req, res) => {
  try {
    const page = req.query.page ?? 1;
    const size = req.query.size ?? 10;
    const { platform, tier, title, state } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (platform) filter.platform = platform;
    if (tier) filter.tier = { $regex: tier, $options: "i" };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (state) filter.state = state;

    const problemList = await Problem.find(filter)
      .skip((page - 1) * size)
      .limit(size);
    res.status(201).json({ data: problemList });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// user id로 problemList를 불러오는 함수
problemController.getProblemListByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const problems = await Problem.find({ userId });
    return res.status(201).json({ message: "success", data: problems });
  } catch (error) {
    return next(error);
  }
};

problemController.getProblemById = async (req, res) => {
  try {
    const { id: problemId } = req.params;
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(400).json({ error: "cannot find problem" });
    }

    return res.status(201).json({ message: "success", data: problem });
  } catch (error) {
    return next(error);
  }
};

problemController.saveSolvedProblem = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { id: problemId } = req.params;
    const { memo } = req.body;
    let problem = await Problem.findById(problemId).session(session);

    if (!problem.userId.equals(userId)) {
      return res.status(400).json({ error: "cannot match user" });
    }
    problem.state = "solved";
    problem.memo = memo;
    await problem.save({ session });

    res.status(200).json({ message: "success" });
    return next();
  } catch (error) {
    return next(error);
  }
};

problemController.shareProblemToStudys = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const { problemId, studyIds } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      const err = new Error("Problem not found");
      err.status = 404;
      throw err;
    }

    const score = exchangeStudyScore(problem.platform, problem.tier);

    for (const studyId of studyIds) {
      const study = await Study.findById(studyId, null, { session });
      if (!study) {
        const err = new Error(`Study no found - ${studyId}`);
        err.status = 404;
        throw err;
      }

      const alreadyShared = study.problems.some(
        (id) => id.toString() === String(problemId)
      );
      if (alreadyShared) continue;

      await StudyUserScore.updateOne(
        { user: problem.userId, study: study._id },
        { $inc: { score } },
        { upsert: true, session }
      );

      await Study.updateOne(
        { _id: study._id, problems: { $ne: problemId } },
        { $push: { problems: problemId }, $inc: { score } },
        { session }
      );
    }

    res.status(200).json({ message: "success" });
    return next();
  } catch (error) {
    return next(error);
  }
};
module.exports = problemController;
