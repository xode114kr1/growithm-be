const Problem = require("../models/Problem");
const { exchangeStudyScore } = require("../utils/score");

const scoreController = {};

scoreController.addScore = async (req, res, next) => {
  const session = req.dbSession;
  const user = req.user;
  const { id: problemId } = req.params;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "cannot find problem" });
    }

    const score = exchangeStudyScore(problem.platform, problem.tier);

    user.score += score;
    await user.save({ session });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = scoreController;
