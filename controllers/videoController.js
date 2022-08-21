const { runGet, runSearch } = require("../utils/es");

const searchVideos = async (req, res) => {
  const searchQuery = req.query.q;
  const pageNumber = req.query.p || 1;
  const pageSize = req.query.s || 10;
  if (!searchQuery) {
    console.error("failed on invalid query params");
    return res
      .status(400)
      .json({ success: false, message: "Invalid query params" });
  }
  try {
    const { hits, total } = await runSearch(searchQuery, pageNumber, pageSize);

    const data = hits.map((doc) => doc._source);
    const hasNext = pageNumber * pageSize < total;
    res
      .status(200)
      .json({ success: true, pageNumber, pageSize, hasNext, total, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

const getVideos = async (req, res) => {
  const pageNumber = req.query.p;
  const pageSize = req.query.s || 10;

  try {
    const { hits, total } = await runGet(pageNumber, pageSize);

    const data = hits.map((doc) => doc._source);
    const hasNext = pageNumber * pageSize < total;
    res
      .status(200)
      .json({ success: true, pageNumber, pageSize, hasNext, total, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

module.exports = {
  searchVideos,
  getVideos,
};
