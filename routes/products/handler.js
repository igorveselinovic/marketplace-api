/**
 * Get a specific product in the store.
 * @param {object} res - Response object
 * @param {string} id - Title of the desired product
 */
function get(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ 'title': id }));
  res.end();
}

/**
 * Get all products in the store.
 * @param {object} res - Response object
 * @param {object} params - Request parameters
 */
function getAll(res, params) {
  const onlyAvailable = params.onlyAvailable && params.onlyAvailable.toLowerCase() == 'true' ? true : false;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify({ onlyAvailable }));
  res.end();
}

module.exports = {
  get,
  getAll
}
