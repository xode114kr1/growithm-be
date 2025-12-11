const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");

const studyRequestController = {};

studyRequestController.getStudyRequestList = async (req, res) => {
  try {
    const userId = req.user._id;

    const studyRequestList = await StudyRequest.find({
      userId,
      state: "pending",
    })
      .populate("studyId")
      .populate("userId");

    return res.status(201).json({
      meeage: "Success to find study request",
      data: studyRequestList,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

studyRequestController.acceptStudtRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { studyRequestId } = req.params;

    const studyRequest = await StudyRequest.findById(studyRequestId);
    if (!studyRequest) {
      return res.status(400).json({ error: "cannot find study request" });
    }

    if (studyRequest.userId.toString() != userId.toString()) {
      return res
        .status(400)
        .json({ error: "is not matched user to study request" });
    }

    studyRequest.state = "accepted";

    const study = await Study.findById(studyRequest.studyId);
    study.members.push(userId);

    await study.save();
    await studyRequest.save();

    return res.status(200).json({ message: "Success to accept study" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

studyRequestController.rejectStudyRequest = async (req, res) => {
  try {
    const { studyRequestId } = req.params;
    await StudyRequest.findByIdAndDelete(studyRequestId);
    return res.status(200).json({ message: "Success reject study request" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = studyRequestController;
