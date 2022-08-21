require("dotenv").config();
const express = require("express");
const cors = require("cors");
var cron = require("node-cron");

const { fetchVideos } = require("./schedulers/ytFetch");
const { bulkInsert } = require("./utils/es");
const { videos } = require("./routes/video");
const { apiKeys } = require("./routes/apiKey");

let lastLatest = "2022-01-01T00:00:00Z";

//Inital Video Fetch
// (async () => {
//   try {
//     const [res, err] = await fetchVideos(lastLatest);
//     if (res) {
//       bulkInsert(res);
//       lastLatest = res.items[0].snippet.publishedAt;
//     } else if (err) {
//       console.error(err);
//     }
//   } catch (err) {
//     console.trace(err);
//   }
// })();

// Runs a fetch every minute
// updates lastLatest video to
// prev latest video's publishedAt timestamp
// next request goes to fetch latest videos
let cc = 0;
const task = cron.schedule("*/10 * * * *", async () => {
  console.log("cron job: ", ++cc);
  try {
    const [res, err] = await fetchVideos(lastLatest);
    if (res) {
      bulkInsert(res);
      lastLatest = res.items[0].snippet.publishedAt;
    } else if (err) {
      console.error(err);
      // can stop tasks if failing,
      // needs to be handled externally
      // by some process manager (pm2 )
      // task.stop();
    }
  } catch (err) {
    console.trace(err);
  }
});

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.enable("trust proxy");

app.get("/api", (req, res) => {
  res.send({
    message:
      "Hi 👋🏻, welcome to the YT Search API, go to /api/video/search?q=music&s=3&p=1",
  });
});

app.use("/api/video", videos);
app.use("/api/key", apiKeys);

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
