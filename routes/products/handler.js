const mongodb = require('mongodb');

/**
 * Get a specific product in the store.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {string} id - Title of the desired product
 */
async function get(res, db, id) {
  let mongoId;
  try {
    mongoId = new mongodb.ObjectID(id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid product ID');
    res.end();
    return;
  }

  try {
    const inventoryDb = await db.collection('inventory');
    const product = await inventoryDb.findOne({
      _id: mongoId
    });

    if (!product) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Product Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(JSON.stringify({ product }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

/**
 * Get all products in the store.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {object} params - Request parameters
 */
async function getAll(res, db, params) {
  const onlyAvailable = params.onlyAvailable && params.onlyAvailable.toLowerCase() == 'true' ? true : false;
  try {
    const inventoryDb = await db.collection('inventory');
    const products = await inventoryDb.find({
      'inventory_count': {
        $gte: onlyAvailable ? 1 : 0
      }
    }).toArray();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(JSON.stringify({ products }));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

module.exports = {
  get,
  getAll
};
