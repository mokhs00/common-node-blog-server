// @ts-check

const fs = require('fs');
const { v4: uuid } = require('uuid');

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

const DB_JSON_FILENAME = 'database.json';

/** @returns {Promise<Object.<string, *>>} */
const readDB = async () => {
  const json = await fs.promises.readFile(DB_JSON_FILENAME, 'utf-8');
  return JSON.parse(json);
};

const savePostsDB = async (/** @type {Post[]} */ posts) => {
  const data = await readDB();
  data.posts = posts;
  await fs.promises.writeFile(DB_JSON_FILENAME, JSON.stringify(data), 'utf-8');
};

/** @returns {Promise<Post[]>}  */
const getPosts = async () => {
  const json = await readDB();
  return json.posts;
};

/** @returns {Promise<Post>} */
const getPostOne = async (/** @type {string } */ postId) => {
  const json = await readDB();
  const { posts } = json;
  const find = posts.find((/** @type {Post} */ _post) => _post.id === postId);

  return find;
};

/** @returns {Promise<Post>} */
const createPost = async (
  /** @type {string} */ title,
  /** @type {string} */ content
) => {
  const posts = await getPosts();

  /** @type {Post} */
  const newPost = {
    id: uuid(),
    title,
    content,
  };

  posts.push(newPost);
  savePostsDB(posts);

  return newPost;
};

module.exports = {
  getPosts,
  getPostOne,
  createPost,
};
