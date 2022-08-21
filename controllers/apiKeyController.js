const { checkKeyIfExists, addKey } = require("../utils/apiKeyStore");
const { axiosInstance } = require("../utils/axiosInstance");

const add = async (req, res) => {
  try {
    const body = req.body;
    console.trace(body);
    const key = body.key;
    console.trace(key);
    if (!key) {
      console.error("failed no body or body.key");
      return res
        .status(200)
        .json({ success: false, message: "Invalid request" });
    }
    if (checkKeyIfExists(key)) {
      return res
        .status(500)
        .json({ success: false, message: "Key already exists" });
    }
    const result = await axiosInstance.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          type: "video",
          maxResults: 1,
          publishedAfter: new Date(),
          order: "date",
          q: "official",
          key,
        },
      }
    );
    console.trace(result.status);
    if (result?.status != 200) {
      // Invalid Keys
      // console.error("failed request, invalid key" + key);
      return res
        .status(404)
        .json({ success: false, message: "Key Invalid or Expired" });
    }
    addKey(key);
    return res.status(200).json({ success: true, message: "Key added" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

module.exports = {
  add,
};
