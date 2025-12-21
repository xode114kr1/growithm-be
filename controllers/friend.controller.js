const User = require("../models/User");

const friendController = {};

friendController.getFriendList = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("friends", "name avatarUrl githubId score")
      .lean();

    return res.status(200).json({ message: "success", data: user.friends });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = friendController;
