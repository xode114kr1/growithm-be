const { default: mongoose } = require("mongoose");
const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");
const StudyUserScore = require("../models/StudyUserScore");

const memberController = {};

memberController.deleteStudyMemberById = async (req, res) => {
  try {
    const { studyId, deleteUserId } = req.query;

    await StudyRequest.findOneAndDelete({ studyId, userId: deleteUserId });

    const updatedStudy = await Study.findByIdAndUpdate(
      studyId,
      { $pull: { members: deleteUserId } },
      { new: true }
    );

    if (!updatedStudy) {
      throw new Error("Study를 찾을 수 없습니다.");
    }

    await StudyUserScore.findOneAndDelete({
      user: deleteUserId,
      study: studyId,
    });

    return res.status(200).json({ message: "Success delete member" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = memberController;
