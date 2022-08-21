const { Router } = require("express");

const { searchVideos, getVideos } = require("../controllers/videoController");

const videos = Router();

videos.get("/search", searchVideos);

videos.get("/", getVideos);

module.exports = {
  videos,
};
