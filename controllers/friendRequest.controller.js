const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const friendRequestController = {};

friendRequestController.getReceiveFriendRequsets = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await FriendRequest.find({ to: userId, state: "pending" })
      .populate("from")
      .populate("to");

    if (!friends) return res.status(401).json({ error: "Cannot find friend" });

    return res.status(201).json({ message: "Success", data: friends });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

friendRequestController.getSendFriendRequsets = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await FriendRequest.find({ from: userId, state: "pending" })
      .populate("from")
      .populate("to");

    if (!friends) return res.status(401).json({ error: "Cannot find friend" });

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
    return res.status(400).json({ error: error.message });
  }
};

friendRequestController.acceptFriendRequest = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (userId.toString() != friendRequest.to.toString()) {
      return res
        .status(401)
        .json({ error: "is not matched user at friendRequest" });
    }

    const friend = await User.findById(friendRequest.from);
    if (!friend) {
      return res.status(400).json({ error: "is not existed friend" });
    }

    friendRequest.state = "accepted";
    user.friends.push(friend._id);
    friend.friends.push(userId);

    await Promise.all([friendRequest.save(), user.save(), friend.save()]);

    return res.status(200).json({
      message: "Success to accept friend request",
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

friendRequestController.rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (userId.toString() != friendRequest.to.toString()) {
      return res
        .status(401)
        .json({ error: "is not matched user at friendRequest" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({
      message: "Success to reject friend request",
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

friendRequestController.cancelFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (userId.toString() != friendRequest.from.toString()) {
      return res
        .status(401)
        .json({ error: "is not matched user at friendRequest" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({
      message: "Success to cancel friend request",
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

friendRequestController.deleteFriendRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    const session = req.dbSession;

    const [a, b] = [userId, friendId].sort();
    const pairKey = `${a}:${b}`;

    await FriendRequest.findOneAndDelete({ pairKey }, { session });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = friendRequestController;
