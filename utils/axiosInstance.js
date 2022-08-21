const axios = require("axios");

exports.axiosInstance = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/search",
});
