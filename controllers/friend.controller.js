const friendController = {};

friendController.getFriendList = (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({ message: "success", data: user.friends });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = friendController;
