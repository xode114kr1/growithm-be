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
    return res.status(400).json({ error: error.message });
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
    return res.status(400).json({ error: error });
  }
};

problemController.saveSolvedProblem = async (req, res) => {
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

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

problemController.shareProblemToStudys = async (req, res) => {
  try {
    const { problemId, studyIds } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "cannot find problem" });
    }

    const score = exchangeStudyScore(problem.platform, problem.tier);

    await Promise.all(
      studyIds.map(async (studyId) => {
        const study = await Study.findById(studyId);
        if (!study) throw new Error(`cannot find study: ${studyId}`);

        const alreadyShared = study.problems.some(
          (id) => id.toString() === String(problemId)
        );
        if (alreadyShared) return;

        await StudyUserScore.updateOne(
          { user: problem.userId, study: study._id },
          { $inc: { score } },
          { upsert: true }
        );

        study.problems.push(problemId);
        study.score += score;
        await study.save();
      })
    );
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = problemController;
