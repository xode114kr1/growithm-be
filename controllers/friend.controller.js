const User = require("../models/User");

const friendController = {};

friendController.getFriendList = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("friends", "name avatarUrl githubId score updatedAt createdAt")
      .lean();

    return res.status(200).json({ message: "success", data: user.friends });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// user의 friends에서 friendId를 삭제
// friend의 friends에서 userId를 삭제
friendController.deleteFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    const session = req.dbSession;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    ).session(session);

    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true }
    ).session(session);

    return res.status(200).json({ message: "Success delete friend" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = friendController;
