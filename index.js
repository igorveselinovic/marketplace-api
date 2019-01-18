'use strict';

const http = require('http');

http.createServer((req, res) => {
  const { pathSegments, queryParameters } = parsePath(req.url);
  console.log(pathSegments);
  console.log(queryParameters);

  if (req.method === 'GET' && pathSegments[0] === 'products' && pathSegments.length === 1) {
    getAllProducts(res, queryParameters);
  } else if (req.method === 'GET' && pathSegments[0] === 'products' && pathSegments.length === 2) {
    getProduct(res, pathSegments[1]);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }
}).listen(8080);

/**
 * Get a specific product in the store.
 * @param {object} res - Response object
 * @param {string} id - Title of the desired product
 */
function getProduct(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'title': id }));
  res.end();
}

/**
 * Get all the products in the store.
 * @param {object} res - Response object
 * @param {object} params - Request parameters
 */
function getAllProducts(res, params) {
  const onlyAvailable = params.onlyAvailable && params.onlyAvailable.toLowerCase() == 'true' ? true : false;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ onlyAvailable }));
  res.end();
}

/**
 * Break a URL request path up into its components.
 * @param {string} path - URL path
 * @return {object} The segments and query parameters of the path
 */
function parsePath(path) {
  let [segments, ...params] = path.split('/?');
  params = params.join('/?');

  if (segments.startsWith('/')) {
    segments = segments.slice(1);
  }

  if (segments.endsWith('/')) {
    segments = segments.slice(0, -1);
  }

  const pathSegments = segments.split('/');

  let queryParameters = {};
  if (params) {
    queryParameters = params.split('&').reduce((accumulator, param) => {
      const keyValuePair = param.split('=');
      accumulator[keyValuePair[0]] = keyValuePair[1];
      return accumulator;
    }, {});
  }
  return { pathSegments, queryParameters };
}
