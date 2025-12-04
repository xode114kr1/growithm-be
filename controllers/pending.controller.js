const PendingProblem = require("../models/PendingProblem");

pendingController = {};

pendingController.getPendingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const pendingList = await PendingProblem.find({ userId: userId });
    res.status(201).json({ data: pendingList });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = pendingController;
