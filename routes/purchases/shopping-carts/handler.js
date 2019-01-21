const mongodb = require('mongodb');

/**
 * Get a specific shopping cart purchase.
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
    res.write('\nInvalid shopping cart purchase ID');
    res.end();
    return;
  }

  try {
    const purchasesDb = await db.collection('shopping_cart_purchases');
    const purchase = await purchasesDb.findOne({
      _id: mongoId
    });

    if (!purchase) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Shopping Cart Purchase Not Found');
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
 * Get all shopping cart purchases.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 */
async function getAll(res, db) {
  try {
    const purchasesDb = await db.collection('shopping_cart_purchases');
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
 * Purchase a shopping cart.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {object} body - Request body
 */
async function post(res, db, body) {
  if (!body.shoppingCartId) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nNo shopping cart ID in request body');
    res.end();
    return;
  }

  let mongoId;
  try {
    mongoId = new mongodb.ObjectID(body.shoppingCartId);
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
    } else if (shoppingCart.products.length === 0) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('400 Bad Request');
      res.write('\nShopping cart is empty');
    } else {
      const document = {
        shoppingCart: {
          id: shoppingCart._id,
          products: shoppingCart.products,
          total_price: shoppingCart.total_price
        }
      };

      const purchases = db.collection('shopping_cart_purchases');
      const insertResult = await purchases.insertOne(document, { w: 1 });
      const insertedDoc = insertResult.ops[0];

      const inventoryDb = db.collection('inventory');
      for (let product of shoppingCart.products) {
        await inventoryDb.updateOne({
          _id: product.id
        }, {
          $inc: {
            inventory_count: -1 * product.quantity
          }
        });
      }

      await shoppingCartsDb.deleteOne({
        _id: mongoId
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
};
