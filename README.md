# Marketplace API
This is a basic marketplace API for Shopify's Summer 2019 Developer Intern Challenge.  

## Dependencies
* [Node.js](https://nodejs.org/en/download/)  
* [npm](https://www.npmjs.com/get-npm)  
* [MongoDB](https://docs.mongodb.com/manual/)  

## Setup
1. Clone the repository:
```
git clone git@github.com:igorveselinovic/marketplace-api.git
```
2. Install npm dependencies:
```
cd marketplace-api
npm install
```
3. Provision the database:
```
node provisioning.js
```

## Running the App
```
node index.js
```

## Cleanup
```
node clean.js
```

## API Reference

---

### Querying Products

**GET/products**  
* Get all (or a subset of all) products  
* Query Parameters:  
  * `/products/?onlyAvailable={true|false}`  
    * Only return products with available inventory  

**GET/product/{id}**  
* Get a specific product  
* {id} = PRODUCT_ID

---

### Purchasing Products (and Querying the Purchases)

**POST/purchases/products**  
* Purchase an item  
* Request Body (JSON):  
```
{
  "productId": "<PRODUCT_ID>"
}
```

**GET/purchases/products**  
* Get all purchases of single products  

**GET/purchases/products/{id}**  
* Get a specific purchase of a single product  
* {id} = PRODUCT_PURCHASE_ID

---

### Managing Shopping Carts

**POST/shopping-carts**  
* Create a shopping cart  

**DELETE/shopping-carts/{id}**  
* Delete a specific shopping cart  
* {id} = SHOPPING_CART_ID

**GET/shopping-carts/{id}**  
* Get a specific shopping cart  
* {id} = SHOPPING_CART_ID

---

### Managing the Items in a Shopping Cart

**POST/shopping-carts/{id}/products**  
* Add item(s) to a specific shopping cart  
* Request Body (JSON):  
```
{
  "product": {
    "id": "<PRODUCT_ID>",
    "quantity": 5
  }
}
```

**DELETE/shopping-carts/{id}/products**  
* Remove item(s) from a specific shopping cart  
* Request Body (JSON):  
```
{
  "product": {
    "id": "<PRODUCT_ID>",
    "quantity": 5
  }
}
```

---

### Purchasing Shopping Carts (and Querying the Purchases)

**POST/purchases/shopping-carts**  
* Purchase the items in a shopping cart  
* Request Body (JSON):  
```
{
  "shoppingCartId": "<SHOPPING_CART_ID>"
}
```

**GET/purchases/shopping-carts**  
* Get all purchases of shopping carts  

**GET/purchases/shopping-carts/{id}**  
* Get a specific purchase of a shopping cart  
* {id} = SHOPPING_CART_PURCHASE_ID

---