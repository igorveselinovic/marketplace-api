/**
 * Remove a product from a shopping cart.
 * @param {object} res - Response object
 * @param {string} id - ID of the shopping cart
 */
function del(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'del': 'Hi', id }));
  res.end();
}

/**
 * Add a product to a shopping cart.
 * @param {object} res - Response object
 * @param {string} id - ID of the shopping cart
 */
function post(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'post': 'Hi', id }));
  res.end();
}

module.exports = {
  del,
  post
};


