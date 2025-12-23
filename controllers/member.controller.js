const { default: mongoose } = require("mongoose");
const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");
const StudyUserScore = require("../models/StudyUserScore");

const memberController = {};

// memberId로 study에서 member 삭제
memberController.kickStudyMemberById = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const { memberId, studyId } = req.params;

    await StudyRequest.findOneAndDelete(
      { studyId, userId: memberId },
      { session }
    );

    const updatedStudy = await Study.findByIdAndUpdate(
      studyId,
      { $pull: { members: memberId } },
      { new: true, session }
    );

    if (!updatedStudy) {
      const error = new Error("Study not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: "Success delete member" });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = memberController;
