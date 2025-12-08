const friendController = {};

friendController.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendName } = req.body;
    console.log(userId, friendName);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports = friendController;
