const Problem = require("../models/Problem");
const Study = require("../models/Study");
const StudyUserScore = require("../models/StudyUserScore");
const { exchangeStudyScore } = require("../utils/score");

const problemController = {};

problemController.getProblemList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page ?? "1");
    const size = parseInt(req.query.size ?? "10");

    const { platform, tier, title, state, startDate, endDate } = req.query;
    const userId = req.user._id;

    const filter = { userId };
    if (platform) filter.platform = platform;
    if (tier) filter.tier = { $regex: tier, $options: "i" };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (state) filter.state = state;

    if (startDate || endDate) {
      filter.timestamp = {};

      if (startDate) filter.timestamp.$gte = startDate;
      if (endDate) filter.timestamp.$lte = endDate;
    }

    const total = await Problem.countDocuments(filter);

    const totalPages = Math.ceil(total / size);

    const problemList = await Problem.find(filter)
      .sort({ _id: -1 })
      .skip((page - 1) * size)
      .limit(size);

    return res.status(200).json({
      message: "Success get problem list",
      data: problemList,
      page,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// user id로 problemList를 불러오는 함수
problemController.getProblemListByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const problems = await Problem.find({ userId });
    return res.status(200).json({ message: "success", data: problems });
  } catch (error) {
    return next(error);
  }
};

problemController.getProblemById = async (req, res, next) => {
  try {
    const { id: problemId } = req.params;
    const problem = await Problem.findById(problemId);

    if (!problem) {
      const error = new Error("Problem not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({ message: "success", data: problem });
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

    if (!problem) {
      const error = new Error("Problem not found");
      error.status = 404;
      return next(error);
    }

    if (!problem.userId.equals(userId)) {
      const error = new Error("Cannot match user");
      error.status = 403;
      return next(error);
    }
    problem.state = "solved";
    problem.memo = memo;
    await problem.save({ session });

    res.status(201).json({ message: "success" });
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
      const error = new Error("Problem not found");
      error.status = 404;
      return next(error);
    }

    const score = exchangeStudyScore(problem.platform, problem.tier);

    for (const studyId of studyIds) {
      const study = await Study.findById(studyId, null, { session });
      if (!study) {
        const error = new Error("Study not found");
        error.status = 404;
        return next(error);
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

    res.status(201).json({ message: "success" });
    return next();
  } catch (error) {
    return next(error);
  }
};
module.exports = problemController;
