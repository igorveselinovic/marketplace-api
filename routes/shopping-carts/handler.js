/**
 * Get a specific shopping cart.
 * @param {object} res - Response object
 * @param {string} id - ID of the shopping cart
 */
function get(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'get': 'Hi', id }));
  res.end();
}

/**
 * Delete a specific shopping cart.
 * @param {object} res - Response object
 * @param {string} id - ID of the shopping cart
 */
function del(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'delete': 'Hi', id }));
  res.end();
}

/**
 * Create a shopping cart.
 * @param {object} res - Response object
 */
function post(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'post': 'Hi' }));
  res.end();
}

module.exports = {
  get,
  del,
  post
};

