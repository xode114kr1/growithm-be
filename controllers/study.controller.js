const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");
const StudyUserScore = require("../models/StudyUserScore");

const studyController = {};

studyController.getStudyList = async (req, res) => {
  try {
    const userId = req.user._id;
    const studyList = await Study.find({ members: userId })
      .populate("members")
      .populate("owner");
    return res
      .status(201)
      .json({ message: "Success to find study list", data: studyList });
  } catch (error) {
    return next(error);
  }
};

studyController.getStudyById = async (req, res) => {
  try {
    const { studyId } = req.params;
    const study = await Study.findById(studyId)
      .populate("members")
      .populate("owner")
      .populate({
        path: "problems",
        populate: {
          path: "userId",
          model: "User",
        },
      });

    return res.status(200).json({ message: "Success find study", data: study });
  } catch (error) {
    return next(error);
  }
};

studyController.createStudy = async (req, res, next) => {
  try {
    const session = req.dbSession;
    const userId = req.user._id;
    const { title, explanation, members } = req.body;

    const [study] = await Study.create(
      [
        {
          title,
          explanation,
          owner: userId,
          members: [userId],
        },
      ],
      { session }
    );

    await Promise.all(
      (members ?? [])?.map((item) =>
        StudyRequest.create([{ studyId: study._id, userId: item }], { session })
      )
    );

    const studyId = study._id;

    await StudyUserScore.findOneAndUpdate(
      { user: userId, study: studyId },
      { $setOnInsert: { user: userId, study: studyId, score: 0 } },
      { upsert: true, new: true, session }
    );

    res.status(200).json({ message: "Success create study" });
    return next();
  } catch (error) {
    return next(error);
  }
};

studyController.getStudyUserScoreById = async (req, res) => {
  try {
    const { studyId } = req.params;
    const studyUserScoreList = await StudyUserScore.find({
      study: studyId,
    }).populate("user");
    return res
      .status(201)
      .json({ message: "success", data: studyUserScoreList });
  } catch (error) {
    return next(error);
  }
};

studyController.deleteStudyById = async (req, res, next) => {
  try {
    const { studyId } = req.params;

    const deleteStudy = await Study.findByIdAndDelete(studyId);

    if (!deleteStudy) {
      const error = new Error("Study not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({ message: "Success delete study" });
  } catch (error) {
    return next(error);
  }
};

module.exports = studyController;
