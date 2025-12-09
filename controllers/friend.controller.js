const friendController = {};

friendController.getFriendList = (req, res) => {
  try {
    return res.status(200).json({ message: "success", data: "data" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = friendController;
