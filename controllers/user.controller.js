const userController = {};

userController.logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: false,
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.json({ message: "logout" });
};

module.exports = userController;
