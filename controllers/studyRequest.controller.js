const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");
const User = require("../models/User");

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
    return next(error);
  }
};

studyRequestController.getSendStudyRequest = async (req, res) => {
  try {
    const { studyId } = req.params;
    const studyRequestList = await StudyRequest.find({
      studyId,
      state: "pending",
    }).populate("userId");
    return res.status(200).json({
      message: "Success find study request list by study id",
      data: studyRequestList,
    });
  } catch (error) {
    return next(error);
  }
};

studyRequestController.sendStudyRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { studyId, inviteUserName } = req.body;

    const study = await Study.findById(studyId);
    if (!study) {
      return res.status(400).json({ error: "cannot find study" });
    }

    if (study.owner.toString() !== userId.toString()) {
      return res.status(400).json({ error: "권한이 없습니다" });
    }

    const inviteUser = await User.findOne({ name: inviteUserName });

    await StudyRequest.create({ studyId, userId: inviteUser });
    return res.status(200).json({ message: "Success to send study request" });
  } catch (error) {
    return next(error);
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
    return next(error);
  }
};

studyRequestController.rejectStudyRequest = async (req, res) => {
  try {
    const { studyRequestId } = req.params;
    await StudyRequest.findByIdAndDelete(studyRequestId);
    return res.status(200).json({ message: "Success reject study request" });
  } catch (error) {
    return next(error);
  }
};

module.exports = studyRequestController;
