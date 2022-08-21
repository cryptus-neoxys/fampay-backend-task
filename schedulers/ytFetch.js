const { axiosInstance } = require("../utils/axiosInstance");
const { getKey, updateKey } = require("../utils/apiKeyStore");

// for cycling through API KEYs
key = getKey();

const fetchVideos = async (lastLatest) => {
  try {
    // fetch video data via YT API
    // update publishedAt after every succesful req
    const res = await axiosInstance.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          type: "video",
          maxResults: 50,
          publishedAfter: lastLatest,
          order: "date",
          q: "official",
          key,
        },
      }
    );

    // console.trace(res.data);
    return [res.data, null];
  } catch (err) {
    console.error(err.data);
    // if errs out through the API
    // update key, send error
    key = updateKey();
    return [null, err];
  }
};

module.exports = {
  fetchVideos,
};
