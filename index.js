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

  let getProductsRoute = new Route('GET', '/products');
  let getProductRoute = new Route('GET', '/products/*');

  let getProductPurchases = new Route('GET', '/purchases/products');
  let getProductPurchase = new Route('GET', '/purchases/products/*');
  let postProductPurchase = new Route('POST', '/purchases/products');

  let getShoppingCartPurchases = new Route('GET', '/purchases/shopping-carts');
  let getShoppingCartPurchase = new Route('GET', '/purchases/shopping-carts/*');
  let postShoppingCartPurchase = new Route('POST', '/purchases/shopping-carts');

  let getShoppingCart = new Route('GET', '/shopping-carts/*');
  let deleteShoppingCart = new Route('DELETE', '/shopping-carts/*');
  let postShoppingCart = new Route('POST', '/shopping-carts');

  let deleteShoppingCartProducts = new Route('DELETE', '/shopping-cart/*/products');
  let postShoppingCartProducts = new Route('POST', '/shopping-cart/*/products');

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
