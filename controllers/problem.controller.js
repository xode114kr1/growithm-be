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

problemController.createSolved = async (req, res) => {
  console.log("createSolved");
};

module.exports = problemController;
