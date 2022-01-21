/* eslint-disable consistent-return */
/* eslint-disable no-console */
// @ts-check

const http = require('http');
const { routes } = require('./api');

const APPLICATION_JSON_UTF8 = 'application/json; encoding=utf-8';
const APPLICATION_JSON = 'application/json';

const server = http.createServer(async (req, res) => {
  const route = routes.find(
    (_route) =>
      req.url &&
      req.method &&
      _route.url.test(req.url) &&
      _route.method === req.method
  );

  if (!req.url || !route) {
    res.statusCode = 404;
    return res.end('Not Found');
  }

  const regexResult = route.url.exec(req.url);

  if (!regexResult) {
    res.statusCode = 404;
    return res.end('Not Found');
  }

  /** @type {Object.<string, *> | Array<Object.<string, *>> | undefined } */
  const body =
    (req.headers['content-type'] === APPLICATION_JSON &&
      (await new Promise((resolve, reject) => {
        req.setEncoding('utf-8');
        req.on('data', (data) => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('Illegal form json'));
          }
        });
      }))) ||
    undefined;

  const result = await route.callback(regexResult, body);

  res.statusCode = result.statusCode;
  if (typeof result.body === 'string') return res.end(result.body);

  res.setHeader('Content-Type', APPLICATION_JSON_UTF8);
  return res.end(JSON.stringify(result.body));
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`);
});
