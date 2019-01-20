/**
 * Get a specific shopping cart.
 * @param {object} res - Response object
 * @param {string} id - ID of the purchase
 */
function get(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ id }));
  res.end();
}

/**
 * Delete a shopping cart.
 * @param {object} res - Response object
 */
function del(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ id }));
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
  post,
  del
}
