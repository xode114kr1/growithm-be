const Study = require("../models/Study");

async function requireStudyOwner(req, res, next) {
  try {
    const userId = req.user._id;
    const { studyId } = req.params;

    if (!studyId) {
      const error = new Error("studyId is required");
      error.status = 400;
      return next(error);
    }

    const study = await Study.findById(studyId);

    if (!study) {
      const error = new Error("Study not found");
      error.status = 404;
      return next(error);
    }

    if (study.owner.toString() !== userId.toString()) {
      const error = new Error("Not study owner");
      error.status = 403;
      return next(error);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireStudyOwner };
