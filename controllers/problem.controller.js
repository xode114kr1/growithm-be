const Problem = require("../models/Problem");

const problemController = {};

problemController.getProblemList = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemList = await Problem.find({ userId: userId });
    res.status(201).json({ data: problemList });
  } catch (error) {
    res.status(400).json({ error: error });
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
    const userId = req.user._id;
    const { id: problemId } = req.params;
    const { memo } = req.body;
    let problem = await Problem.findById(problemId);
    console.log(problem.userId, userId);
    if (!problem.userId.equals(userId)) {
      return res.status(400).json({ error: "cannot match user" });
    }
    problem.state = "solved";
    problem.memo = memo;
    await problem.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports = problemController;
