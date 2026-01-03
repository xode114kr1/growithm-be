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
      const error = new Error("Problem not found");
      error.status = 404;
      return next(error);
    }

    const score = exchangeStudyScore(problem.platform, problem.tier);

    user.score += score;
    await user.save({ session });

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = scoreController;
