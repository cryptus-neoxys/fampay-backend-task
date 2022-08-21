const { Router } = require("express");

const { add } = require("../controllers/apiKeyController");

const apiKeys = Router();

apiKeys.post("/add", add);

module.exports = {
  apiKeys,
};
