const mongodb = require('mongodb');

/**
 * Remove a product from a shopping cart.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {string} id - ID of the shopping cart
 * @param {object} body - Request body
 */
async function del(res, db, id, body) {
  if (!body.product || !body.product.id) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nNo product ID in request body');
    res.end();
    return;
  }

  let shoppingCartMongoId;
  try {
    shoppingCartMongoId = new mongodb.ObjectID(id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid shopping cart ID');
    res.end();
    return;
  }

  let productMongoId;
  try {
    productMongoId = new mongodb.ObjectID(body.product.id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid product ID');
    res.end();
    return;
  }

  const quantity = body.product.quantity && body.product.quantity > 0 ? body.product.quantity : 1;

  try {
    const shoppingCartsDb = await db.collection('shopping_carts');
    const shoppingCart = await shoppingCartsDb.findOne({
      _id: shoppingCartMongoId
    });

    if (!shoppingCart) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Shopping Cart Not Found');
    } else {
      const productInCart = shoppingCart.products.find((product) => {
        return product.id.toString() === body.product.id;
      });
      const currentCartQuantity = productInCart ? productInCart.quantity : 0;

      if (!productInCart) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Product Not Found');
      } else if (currentCartQuantity < quantity) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write('400 Bad Request');
        res.write('\nCannot remove that many copies of this product');
      } else {
        if (currentCartQuantity - quantity === 0) {
          shoppingCartsDb.updateOne({
            _id: shoppingCartMongoId
          }, {
            $pull: {
              products: {
                id: productMongoId
              }
            },
            $inc: {
              total_price: - productInCart.price * quantity
            }
          });
        } else {
          shoppingCartsDb.updateOne({
            '_id': shoppingCartMongoId,
            'products.id': productMongoId
          }, {
            $inc: {
              'products.$.quantity': - quantity,
              'total_price': - productInCart.price * quantity
            }
          });
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('200 Created');
        res.write('\nRemoved product(s) from shopping cart');
      }
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

/**
 * Add a product to a shopping cart.
 * @param {object} res - Response object
 * @param {object} db - MongoDB database object
 * @param {string} id - ID of the shopping cart
 * @param {object} body - Request body
 */
async function post(res, db, id, body) {
  if (!body.product || !body.product.id) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nNo product ID in request body');
    res.end();
    return;
  }

  let shoppingCartMongoId;
  try {
    shoppingCartMongoId = new mongodb.ObjectID(id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid shopping cart ID');
    res.end();
    return;
  }

  let productMongoId;
  try {
    productMongoId = new mongodb.ObjectID(body.product.id);
  } catch (error) {
    console.error('Received invalid ID');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('400 Bad Request');
    res.write('\nInvalid product ID');
    res.end();
    return;
  }

  const quantity = body.product.quantity && body.product.quantity > 0 ? body.product.quantity : 1;

  try {
    const shoppingCartsDb = await db.collection('shopping_carts');
    const shoppingCart = await shoppingCartsDb.findOne({
      _id: shoppingCartMongoId
    });

    if (!shoppingCart) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Shopping Cart Not Found');
    } else {
      const productsDb = await db.collection('inventory');
      const product = await productsDb.findOne({
        _id: productMongoId
      });

      const productInCart = shoppingCart.products.find((product) => {
        return product.id.toString() === body.product.id;
      });
      const currentCartQuantity = productInCart ? productInCart.quantity : 0;

      if (!product) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Product Not Found');
      } else if (product.inventory_count < quantity + currentCartQuantity) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write('400 Bad Request');
        res.write('\nCannot purchase that many copies of this product');
      } else {
        const productsInCart = shoppingCart.products.map((product) => product.id.toString());
        if (productsInCart.indexOf(body.product.id) === -1 ) {
          shoppingCartsDb.updateOne({
            _id: shoppingCartMongoId
          }, {
            $push: {
              products: {
                id: productMongoId,
                quantity,
                title: product.title,
                price: product.price
              }
            },
            $inc: {
              total_price: product.price * quantity
            }
          });
        } else {
          shoppingCartsDb.updateOne({
            '_id': shoppingCartMongoId,
            'products.id': productMongoId
          }, {
            $inc: {
              'products.$.quantity': quantity,
              'total_price': product.price * quantity
            },
          });
        }

        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.write('201 Created');
        res.write('\nAdded product(s) to shopping cart');
      }
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('500 Internal Server Error');
  }

  res.end();
}

module.exports = {
  del,
  post
};


