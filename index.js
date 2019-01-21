'use strict';

const http = require('http');
const Route = require('./route.js');
const MongoClient = require('mongodb').MongoClient;

const productsHandler = require('./routes/products/handler.js');
const productPurchasesHandler = require('./routes/purchases/products/handler.js');
const shoppingCartPurchasesHandler = require('./routes/purchases/shopping-carts/handler.js');
const shoppingCartsHandler = require('./routes/shopping-carts/handler.js');
const shoppingCartProductsHandler = require('./routes/shopping-carts/products/handler.js');

const getProductsRoute = new Route('GET', '/products');
const getProductRoute = new Route('GET', '/products/*');

const getProductPurchases = new Route('GET', '/purchases/products');
const getProductPurchase = new Route('GET', '/purchases/products/*');
const postProductPurchase = new Route('POST', '/purchases/products');

const getShoppingCartPurchases = new Route('GET', '/purchases/shopping-carts');
const getShoppingCartPurchase = new Route('GET', '/purchases/shopping-carts/*');
const postShoppingCartPurchase = new Route('POST', '/purchases/shopping-carts');

const getShoppingCart = new Route('GET', '/shopping-carts/*');
const deleteShoppingCart = new Route('DELETE', '/shopping-carts/*');
const postShoppingCart = new Route('POST', '/shopping-carts');

const deleteShoppingCartProducts = new Route('DELETE', '/shopping-carts/*/products');
const postShoppingCartProducts = new Route('POST', '/shopping-carts/*/products');

http.createServer(async (req, res) => {
  const { pathSegments, queryParameters } = parsePath(req.url);
  const bodyString = await getRequestBody(req);
  let body;

  try {
    body = JSON.parse(bodyString);
  } catch (error) {
    console.error('Received invalid JSON in request body.');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nBody is not valid JSON');
    res.end();
    return;
  }

  const mongoClient = await MongoClient.connect('mongodb://localhost:27017/exampleDb', { 'useNewUrlParser': true });
  const db = mongoClient.db('marketplace-db'); // TODO: Make this a config variable

  if (getProductRoute.validateRequest(req.method, pathSegments)) {
    await productsHandler.get(res, db, pathSegments[1]);
  } else if (getProductsRoute.validateRequest(req.method, pathSegments)) {
    await productsHandler.getAll(res, db, queryParameters);
  }

  else if (getProductPurchase.validateRequest(req.method, pathSegments)) {
    await productPurchasesHandler.get(res, db, pathSegments[2]);
  } else if (getProductPurchases.validateRequest(req.method, pathSegments)) {
    await productPurchasesHandler.getAll(res, db);
  } else if (postProductPurchase.validateRequest(req.method, pathSegments)) {
    await productPurchasesHandler.post(res, db, body);
  }

  else if (getShoppingCart.validateRequest(req.method, pathSegments)) {
    await shoppingCartsHandler.get(res, db, pathSegments[1]);
  } else if (deleteShoppingCart.validateRequest(req.method, pathSegments)) {
    await shoppingCartsHandler.del(res, db, pathSegments[1]);
  } else if (postShoppingCart.validateRequest(req.method, pathSegments)) {
    await shoppingCartsHandler.post(res, db);
  }

  else if (getShoppingCartPurchase.validateRequest(req.method, pathSegments)) {
    shoppingCartPurchasesHandler.get(res, pathSegments[2]);
  } else if (getShoppingCartPurchases.validateRequest(req.method, pathSegments)) {
    shoppingCartPurchasesHandler.getAll(res, queryParameters);
  } else if (postShoppingCartPurchase.validateRequest(req.method, pathSegments)) {
    shoppingCartPurchasesHandler.post(res);
  }

  else if (deleteShoppingCartProducts.validateRequest(req.method, pathSegments)) {
    shoppingCartProductsHandler.del(res, pathSegments[1]);
  } else if (postShoppingCartProducts.validateRequest(req.method, pathSegments)) {
    shoppingCartProductsHandler.post(res, pathSegments[1]);
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }

  mongoClient.close();
}).listen(8080);

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

/**
 * Get the body of an HTTP request
 * @param {object} req - HTTP request
 * @return {object} Promise that contains request body
 */
function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      resolve(body);
    });
  });
}
