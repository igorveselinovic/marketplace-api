/**
 * Get a specific shopping cart purchase.
 * @param {object} res - Response object
 * @param {string} id - ID of the purchase
 */
function get(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ id }));
  res.end();
}

/**
 * Get all shopping cart purchases.
 * @param {object} res - Response object
 */
function getAll(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'getall': 'Hi'}));
  res.end();
}

/**
 * Purchase a shopping cart.
 * @param {object} res - Response object
 */
function post(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'post': 'Hi'}));
  res.end();
}

module.exports = {
  get,
  getAll,
  post
}
