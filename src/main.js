/* eslint-disable no-console */
// @ts-check

const { v4: uuid } = require('uuid');
const http = require('http');

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: '1',
    title: 'POST TITLE',
    content: 'POST CONTENT',
  },
];

const APPLICATION_JSON_UTF8 = 'application/json; encoding=utf-8';

const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
  const postIdRegexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;

  // @GET /posts
  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
      totalCount: posts.length,
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', APPLICATION_JSON_UTF8);
    return res.end(JSON.stringify(result));
  }

  // @GET /posts/:id
  if (postIdRegexResult && req.method === 'GET') {
    const postId = postIdRegexResult[1];
    const findPost = posts.filter((post) => post.id === postId);

    if (!findPost.length) {
      res.setHeader('Content-Type', APPLICATION_JSON_UTF8);
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'Not Found' }));
    }

    res.setHeader('Content-Type', APPLICATION_JSON_UTF8);
    res.statusCode = 200;
    return res.end(JSON.stringify(findPost.pop()));
  }

  // @POST /posts
  if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8');
    req.on('data', (data) => {
      /**
       * @typedef CreatePostRequest
       * @property {string} title
       * @property {string} content
       */
      /** @type {CreatePostRequest} */
      const request = JSON.parse(data);

      const newPost = {
        id: uuid(),
        title: request.title,
        content: request.content,
      };
      posts.push(newPost);

      res.setHeader('Content-Type', APPLICATION_JSON_UTF8);
      res.statusCode = 201;
      return res.end(JSON.stringify(newPost));
    });

    return null;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`);
});
