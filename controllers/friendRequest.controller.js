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
    return next(error);
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
    return next(error);
  }
};

friendRequestController.sendFriendRequest = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { friendName } = req.body;

    const friend = await User.findOne({ name: friendName });

    if (!friend) {
      const error = new Error("Friend not found");
      error.status = 404;
      return next(error);
    }

    await FriendRequest.create(
      [
        {
          from: userId,
          to: friend._id,
        },
      ],
      { session }
    );

    res.status(200).json({ message: "Success send friend request" });
    return next();
  } catch (error) {
    return next(error);
  }
};

friendRequestController.acceptFriendRequest = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      const error = new Error("Friend-request not found");
      error.status = 404;
      return next(error);
    }

    if (userId.toString() != friendRequest.to.toString()) {
      const error = new Error("Friend-request not match user-id");
      error.status = 401;
      return next(error);
    }

    const [updatedUser, updatedFriend] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendRequest.from } },
        { new: true, session }
      ),
      User.findByIdAndUpdate(
        friendRequest.from,
        { $addToSet: { friends: userId } },
        { new: true, session }
      ),
    ]);

    if (!updatedFriend) {
      const error = new Error("Friend not found");
      error.status = 404;
      return next(error);
    }

    if (!updatedUser) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    friendRequest.state = "accepted";
    await friendRequest.save({ session });

    res.status(200).json({ message: "Success to accept friend request" });
    return next();
  } catch (error) {
    return next(error);
  }
};

friendRequestController.rejectFriendRequest = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      const error = new Error("Friend-request not found");
      error.status = 404;
      return next(error);
    }

    if (userId.toString() != friendRequest.to.toString()) {
      const error = new Error("Friend-request not match user-id");
      error.status = 401;
      return next(error);
    }

    await FriendRequest.findByIdAndDelete(requestId, { session });

    res.status(200).json({ message: "Success to reject friend request" });
    return next();
  } catch (error) {
    return next(error);
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
    return next(error);
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
