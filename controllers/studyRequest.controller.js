const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");
const StudyUserScore = require("../models/StudyUserScore");
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

studyRequestController.sendStudyRequest = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { studyId } = req.params;
    const { inviteUserName } = req.body;

    const study = await Study.findById(studyId);

    const inviteUser = await User.findOne({ name: inviteUserName });

    if (!study) {
      const error = new Error("Study not found");
      error.status = 404;
      return next(error);
    }

    if (study.owner.toString() == inviteUser.toString()) {
      const error = new Error("Owner cannot leave");
      error.status = 403;
      return next(error);
    }

    await StudyRequest.create([{ studyId, userId: inviteUser }], { session });

    res.status(200).json({ message: "Success to send study request" });
    return next();
  } catch (error) {
    return next(error);
  }
};

studyRequestController.acceptStudyRequest = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { studyRequestId } = req.params;

    // 스터디 요청 인증
    const studyRequest = await StudyRequest.findById(studyRequestId, null, {
      session,
    });

    if (!studyRequest) {
      const error = new Error("Study-request not found");
      error.status = 404;
      return next(error);
    }

    if (studyRequest.state !== "pending") {
      if (studyRequest.state === "accepted") {
        const error = new Error("Study-request already accepted");
        error.status = 409;
        return next(error);
      } else if (studyRequest.state === "rejected") {
        const error = new Error("Study-request already rejected");
        error.status = 409;
        return next(error);
      }
    }

    if (studyRequest.userId.toString() != userId.toString()) {
      const error = new Error("Study-request access denied");
      error.status = 403;
      return next(error);
    }
    // 스터디 요청 수락
    studyRequest.state = "accepted";
    await studyRequest.save({ session });

    // 스터디에 맴버 추가
    const studyId = studyRequest.studyId;
    const updatedStudy = await Study.findByIdAndUpdate(
      studyId,
      { $addToSet: { members: userId } },
      { session, new: true }
    );

    if (!updatedStudy) {
      const error = new Error("Study not found");
      error.status = 404;
      return next(error);
    }

    // 스터디의 유저 스코어 생성
    await StudyUserScore.findOneAndUpdate(
      { user: userId, study: studyId },
      { $setOnInsert: { user: userId, study: studyId, score: 0 } },
      { upsert: true, new: true, session }
    );

    res.status(200).json({ message: "Success to accept study" });
    return next();
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
