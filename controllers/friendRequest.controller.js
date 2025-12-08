const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const friendRequestController = {};

friendRequestController.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendName } = req.body;

    const friend = await User.findOne({ name: friendName });

    if (!friend) {
      return res.status(400).json({ error: "Invalied friend name" });
    }

    const friendRequest = await FriendRequest.create({
      from: userId,
      to: friend._id,
    });

    return res.status(200).json({ message: "Success send friend request" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports = friendRequestController;
