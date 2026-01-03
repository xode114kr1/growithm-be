const User = require("../models/User");

const userController = {};

userController.logout = async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.json({ message: "logout" });
};

userController.getUserByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    const user = await User.findOne({ name });

    const userObj = user.toObject();

    delete userObj.githubAccessToken;

    return res
      .status(200)
      .json({ message: "Success find user by name", data: userObj });
  } catch (error) {
    return next(error);
  }
};

module.exports = userController;
