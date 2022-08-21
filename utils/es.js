const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://elasticsearch:9200" });

const bulkInsert = async (videos) => {
  console.log("bulk insert: ", videos);
  client
    .info()
    .then((d) => console.trace(d.body))
    .catch((e) => console.error(e));
  await client.indices.create(
    {
      index: "videos",
      body: {
        mappings: {
          properties: {
            id: { type: "string" },
            publishedAt: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            thumbnail: { type: "string" },
          },
        },
      },
    },
    { ignore: [400] }
  );

  // mapping videos into desired format
  const data = videos.items
    .map((video) => {
      if (video.id.kind == "youtube#video")
        return {
          id: video.id.videoId,
          publishedAt: video.snippet.publishedAt,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.default.url,
        };
    }) // we need to remove the nulls, returned from map
    .filter((video) => video);

  const body = data.flatMap((doc) => [{ index: { _index: "videos" } }, doc]);

  const { body: bulkResponse } = await client.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.trace(erroredDocuments);
  }

  const { body: count } = await client.count({ index: "videos" });
  console.log("Insert Count: ", count);
};

async function runGet(pageNumber, pageSize) {
  // get videos!

  // handle case for invalid params
  pageNumber = parseInt(pageNumber);
  pageNumber = pageNumber || 0;

  pageSize = parseInt(pageSize);
  pageSize = pageSize || 10;

  // get all videos from elasticsearch using match_all
  // use from and size for offset based pagination

  const { body } = await client.search({
    index: "videos",
    from: pageSize * (pageNumber - 1),
    size: pageSize,
    sort: "publishedAt:desc",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  // return data and total matches in database
  return { hits: body.hits.hits, total: body.hits.total.value };
}

async function runSearch(searchQuery, pageNumber, pageSize) {
  // Let's search!

  // handle case for invalid params
  pageNumber = parseInt(pageNumber);
  pageNumber = pageNumber || 0;

  pageSize = parseInt(pageSize);
  pageSize = pageSize || 10;

  // get full text search results using query `match`
  // from elasticsearch
  // Match query with title and desc fields
  // for each select best score from both fields
  // use from and size for offset based pagination

  const { body } = await client.search({
    index: "videos",
    from: pageSize * (pageNumber - 1),
    size: pageSize,
    sort: "publishedAt:desc",
    body: {
      query: {
        // multi_match serves the purpose from line:114
        multi_match: {
          query: searchQuery,
          fields: ["title", "description"],
          type: "best_fields",
          // tie_breaker can optionally be enabled (not set)
          // to include both fields
          // tie_breaker: 0.2,
        },
      },
    },
  });

  return { hits: body.hits.hits, total: body.hits.total.value };
}
module.exports = {
  bulkInsert,
  runGet,
  runSearch,
};
