// @ts-check

const { v4: uuid } = require('uuid');

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST' | 'PUST' | 'PATCH' | 'DELETE'} method
 * @property {(matches: string[], body: Object.<string, *> | undefined) => Promise<APIResponse>} callback
 */

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

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      body: posts,
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1];

      const find = posts.find((_post) => _post.id === postId);

      if (!find) {
        return {
          statusCode: 404,
          body: 'Not Found',
        };
      }

      return { statusCode: 200, body: find };
    },
  },
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_, body) => {
      if (!body || !body.title || !body.content) {
        return {
          statusCode: 400,
          body: 'Illegal form request',
        };
      }

      const newPost = {
        id: uuid(),
        title: body.title,
        content: body.content,
      };

      posts.push(newPost);

      return { statusCode: 201, body: newPost };
    },
  },
];

module.exports = {
  routes,
};
