const mongodb = require('mongodb');

/**
 * Get a specific product purchase.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {string} id - ID of the purchase
 */
async function get(res, db, id) {
  let mongoId;
  try {
    mongoId = new mongodb.ObjectID(id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid product purchase ID');
    res.end();
    return;
  }

  try {
    const purchasesDb = await db.collection('product_purchases');
    const purchase = await purchasesDb.findOne({
      _id: mongoId
    });

    if (!purchase) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Product Purchase Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(JSON.stringify({ purchase }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

/**
 * Get all product purchases.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 */
async function getAll(res, db) {
  try {
    const purchasesDb = await db.collection('product_purchases');
    const purchases = await purchasesDb.find().toArray();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(JSON.stringify({ purchases }));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

/**
 * Purchase a product.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {object} body - Request body
 */
async function post(res, db, body) {
  if (!body.productId) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nNo product ID');
    res.end();
    return;
  }

  let mongoId;
  try {
    mongoId = new mongodb.ObjectID(body.productId);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid product ID');
    res.end();
    return;
  }

  try {
    const inventory = db.collection('inventory');
    const product = await inventory.findOne({
      _id: mongoId
    });

    if (!product) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Product Not Found');
    } else {
      const document = {
        product: {
          id: product._id,
          title: product.title,
          price: product.price
        }
      };

      const purchases = db.collection('product_purchases');
      const insertResult = await purchases.insertOne(document, { 'w': 1 });
      const insertedDoc = insertResult.ops[0];

      console.log(insertedDoc._id)
      await inventory.updateOne({
        _id: insertedDoc.product.id
      }, {
        $inc: {
          inventory_count: -1
        }
      });

      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.write(JSON.stringify({ purchase: insertedDoc }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

module.exports = {
  get,
  getAll,
  post
}
