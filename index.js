'use strict';

const http = require('http');
const Route = require('./route.js');

const productsHandler = require('./routes/products/handler.js');
const productPurchasesHandler = require('./routes/purchases/products/handler.js');
const shoppingCartPurchasesHandler = require('./routes/purchases/shopping-carts/handler.js');
const shoppingCartsHandler = require('./routes/shopping-carts/handler.js');
const shoppingCartProductsHandler = require('./routes/shopping-carts/products/handler.js');

http.createServer((req, res) => {
  const { pathSegments, queryParameters } = parsePath(req.url);

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

  if (getProductRoute.validateRequest(req.method, pathSegments)) {
    productsHandler.get(res, pathSegments[1]);
  } else if (getProductsRoute.validateRequest(req.method, pathSegments)) {
    productsHandler.getAll(res, queryParameters);
  }

  else if (getProductPurchase.validateRequest(req.method, pathSegments)) {
    productPurchasesHandler.get(res, pathSegments[2]);
  } else if (getProductPurchases.validateRequest(req.method, pathSegments)) {
    productPurchasesHandler.getAll(res, queryParameters);
  } else if (postProductPurchase.validateRequest(req.method, pathSegments)) {
    productPurchasesHandler.post(res);
  }

  else if (getShoppingCartPurchase.validateRequest(req.method, pathSegments)) {
    shoppingCartPurchasesHandler.get(res, pathSegments[2]);
  } else if (getShoppingCartPurchases.validateRequest(req.method, pathSegments)) {
    shoppingCartPurchasesHandler.getAll(res, queryParameters);
  } else if (postShoppingCartPurchase.validateRequest(req.method, pathSegments)) {
    shoppingCartPurchasesHandler.post(res);
  }

  else if (getShoppingCart.validateRequest(req.method, pathSegments)) {
    shoppingCartsHandler.get(res, pathSegments[1]);
  } else if (deleteShoppingCart.validateRequest(req.method, pathSegments)) {
    shoppingCartsHandler.del(res, pathSegments[1]);
  } else if (postShoppingCart.validateRequest(req.method, pathSegments)) {
    shoppingCartsHandler.post(res);
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
