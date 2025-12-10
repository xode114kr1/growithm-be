const studyController = {};

studyController.createStudy = async (req, res) => {
  try {
    // const userId = req.user._id;
    const { title, explanation, members } = req.body;
    console.log(title, explanation, members);
    return res.status(200).json({
      message: "Success",
      data: { title, explanation, members },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = studyController;
