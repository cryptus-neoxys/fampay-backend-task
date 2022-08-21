let keys = process.env.YT_API_API_KEYS.split(", ");
let currKeyIndex = 0;

const addKey = (key) => {
  keys.push(key);
  console.trace(keys);
  return keys;
};

const getKey = () => {
  console.trace(keys[currKeyIndex]);
  return keys[currKeyIndex];
};

const updateKey = () => {
  currKeyIndex = (currKeyIndex + 1) % keys.length;
  console.trace(keys[currKeyIndex]);
  return keys[currKeyIndex];
};

const checkKeyIfExists = (key) => {
  return keys.includes(key);
};

module.exports = {
  keys,
  getKey,
  addKey,
  updateKey,
  checkKeyIfExists,
};
