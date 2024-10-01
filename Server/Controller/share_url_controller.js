const Share_Url_Model = require("../Model/share_url_model");

const { v4: uuidv4 } = require("uuid");

const generateSharableUrl = async (req, res) => {
  try {
    const uniqueId = uuidv4();
    const { storyId, slideNumber } = req.body;

    if (!storyId) {
      return res
        .status(404)
        .json({ message: "Error in accessing Story", error: "", data: "" });
    }
    const newUrl = new Share_Url_Model({
      urlId: uniqueId,
      storyData: storyId,
      slideNumber: slideNumber,
    });
    const response = await newUrl.save();
    if (!response) {
      return res
        .status(500)
        .json({ message: "Error in Generating URL", error: error, data: "" });
    }

    const url = `https://share-story-x.vercel.app/api/story/share/${uniqueId}/${slideNumber}`;
    return res
      .status(200)
      .json({
        message: "Successfully Generated Story URL",
        error: "",
        data: url,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in Generating URL", error: error, data: "" });
  }
};

const sharableStoryData = async (req, res) => {
  try {
    const slideNumber = req.params.slideNumber;
    const urlId = req.params.id;
    const data = await Share_Url_Model.find({ urlId: urlId });

    const storyExist = await Share_Url_Model.findOne({ urlId: urlId }).populate(
      {
        path: "storyData",
      }
    );
    // console.log(storyExist)

    if (!storyExist) {
      return res
        .status(404)
        .json({ message: "Not Exist", error: "", data: "" });
    }

    return res
      .status(200)
      .json({ message: "Successfully", error: "", data: storyExist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server eroor", error: error.message, data: "" });
  }
};

module.exports = { generateSharableUrl, sharableStoryData };
