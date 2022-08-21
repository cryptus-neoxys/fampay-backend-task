# fampay-backend-task

# Project Goal

To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

# ✅ Basic Requirements:

- ✅ Server should call the YouTube API continuously in background (async) with some interval (using 1 minute) for fetching the latest videos for a predefined search query and should store the data of videos (specifically these fields - Video title, description, publishing datetime, thumbnails URLs) in a database with proper indexes.
- ✅ A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
  - endpoint: /api/video
  - sample query: http://localhost/api/video?p=2&s=3
- ✅ A basic search API to search the stored videos using their title and description.
  - endpoint: /api/video/search
  - sample query: http://localhost/api/video/search?s=music&p=2&s=3
- ✅ Dockerize the project.
  - run using docker-compose
- ✅ It should be scalable and optimised.

# Bonus Points:

- ✅ Add support for supplying multiple API keys so that if quota is exhausted on one, it automatically uses the next available key.
  - User can add more keys to the API, using the `http://localhost/api/key/add`{"key": "G_API_KEY"}
  - can cycle through multiple API keys when current key gets exhausted
- 🚧 Make a dashboard to view the stored videos with filters and sorting options (optional)
- ✅ **Optimise** search api, so that it's able to search videos containing partial match for the search query in either video title or description.
  - using ElasticSearch with full text search and partial match capabilities, works perfectly optimising searches for partial and string distance based matching.
  - Other alternatives:
    - Use [in-built postgres](https://www.postgresql.org/docs/current/textsearch.html) search fns: `tsquery` with `tsvector` and ranking results with `ts_rank` or `ts_rank_cd`
    - Use Postgres in combination with ES, to store doc(row) refs with search fields in Elastic Search, so as to search in ES and retrieve from Postgres using the refs from ES query results.

# Instructions

Pre-requisites: docker and docker compose installed.

- Clone the repo `git clone https://github.com/cryptus-neoxys/fampay-backend-task.git`
- Open directory in terminal `cd fampay-backend-task`
- copy .env file `cp .env.example .env`
- Add the API KEYS in .env file
- Run docker compose `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
- Project should be running via nginx proxy on `PORT:80` (default http port)
- Go to http://localhost/api
- To stop the project run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`

## API

### Videos

- `GET`
  - endpoint: /api/video
  - response: `{data: []video, success: bool, pageNumber: int, pageSize: int, hasNext: bool, total: int}`
  - sample query: http://localhost/api/video?p=2&s=3
  - query params:

| param | for         | required | type |
| ----- | ----------- | -------- | ---- |
| p     | page number | true     | int  |
| s     | page size   | true     | int  |

- `SEARCH`
  - endpoint: /api/video/search
  - response: `{data: []video, success: bool, pageNumber: int, pageSize: int, hasNext: bool, total: int}`
  - sample query: http://localhost/api/video/search?s=music&p=2&s=3
  - query params:

| param | for         | required | type   |
| ----- | ----------- | -------- | ------ |
| p     | page number | true     | int    |
| s     | page size   | true     | int    |
| q     | search term | true     | string |

### API_KEY

- `POST` - add keys
  - endpoint: /api/key/add
  - response: `{success: boolean, message?: Error message}`
  - sample query: http://localhost/api/video/add {"key": "API_KEY"}
  - request body: JSON {"key": "API_KEY"}

| key | value   | required | type   |
| --- | ------- | -------- | ------ |
| key | API_KEY | true     | string |

# Tech Stack

<p align="left">
        <a href="https://www.docker.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a>
        <a href="https://www.elastic.co" target="_blank"> <img src="https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg" alt="elasticsearch" width="40" height="40"/> </a>
        <a href="https://expressjs.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a>
        <a href="https://www.nginx.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg" alt="nginx" width="40" height="40"/> </a>
        <a href="https://nodejs.org" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a>
</p>

# Reference:

- YouTube data v3 API: [https://developers.google.com/youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started)
- Search API reference: [https://developers.google.com/youtube/v3/docs/search/list](https://developers.google.com/youtube/v3/docs/search/list)
- ElasticSearch node.js client: [https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- Making Elastic Search work with Postgres ZomboDB: [https://docs.elastic.co/en/integrations/postgresql](https://docs.elastic.co/en/integrations/postgresql)
- Elastic Search Integration with Postgres: [https://docs.elastic.co/en/integrations/postgresql](https://docs.elastic.co/en/integrations/postgresql)
