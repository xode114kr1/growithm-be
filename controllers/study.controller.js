const Study = require("../models/Study");
const StudyRequest = require("../models/StudyRequest");

const studyController = {};

studyController.createStudy = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, explanation, members } = req.body;

    const study = await Study.create({ title, explanation, owner: userId });

    members?.map(async (item) => {
      const studyRequest = await StudyRequest.create({
        studyId: study?._id,
        userId: item,
      });
      if (!studyRequest) {
        return res.status(404).json({ error: "cannot create study request" });
      }
    });

    return res.status(200).json({
      message: "Success",
      data: { title, explanation, members, userId },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = studyController;
