const mongodb = require('mongodb');

/**
 * Get a specific shopping cart.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {string} id - ID of the shopping cart
 */
async function get(res, db, id) {
  let mongoId;
  try {
    mongoId = new mongodb.ObjectID(id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid shopping cart ID');
    res.end();
    return;
  }

  try {
    const shoppingCartsDb = db.collection('shopping_carts');
    const shoppingCart = await shoppingCartsDb.findOne({
      _id: mongoId
    });

    if (!shoppingCart) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Shopping Cart Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(JSON.stringify({ shoppingCart }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

/**
 * Delete a specific shopping cart.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {string} id - ID of the shopping cart
 */
async function del(res, db, id) {
  let mongoId;
  try {
    mongoId = new mongodb.ObjectID(id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid shopping cart ID');
    res.end();
    return;
  }

  try {
    const shoppingCartsDb = db.collection('shopping_carts');
    const deleteResult = await shoppingCartsDb.deleteOne({
      _id: mongoId
    });

    if (deleteResult.result.n === 1) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('200 OK');
      res.write('\nShopping cart deleted');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Shopping Cart Not Found');
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

/**
 * Create a shopping cart.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 */
async function post(res, db) {
  try {
    const document = {
      products: [],
      total_price: 0
    };

    const shoppingCartsDb = db.collection('shopping_carts');
    const insertResult = await shoppingCartsDb.insertOne(document, { w: 1 });
    const insertedDoc = insertResult.ops[0];

    res.writeHead(201, { 'Content-Type': 'text/plain' });
    res.write(JSON.stringify({ shopping_cart: insertedDoc }));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

module.exports = {
  get,
  del,
  post
};

