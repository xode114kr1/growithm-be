const StudyRequest = require("../models/StudyRequest");

const studyRequestController = {};

studyRequestController.getStudyRequestList = async (req, res) => {
  try {
    const userId = req.user._id;

    const studyRequest = await StudyRequest.find({ userId })
      .populate("studyId")
      .populate("userId");

    return res
      .status(201)
      .json({ meeage: "Success to find study request", data: studyRequest });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

studyRequestController.acceptStudtRequest = async (req, res) => {};

module.exports = studyRequestController;
