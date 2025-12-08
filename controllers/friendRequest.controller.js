const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const friendRequestController = {};

friendRequestController.getWaitFriendRequsets = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await FriendRequest.find({ from: userId }).populate("to");

    if (!friends) return res.status(401).json({ error: "Cannot find friend" });
    console.log(friends);
    return res.status(201).json({ message: "Success", data: friends });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

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
