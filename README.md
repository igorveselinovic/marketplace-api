GET/products -> get all products  
GET/product/{id} -> get a specific product  

-----------------------------------------------------------------------------------------------------------------------

POST/purchases/products -> purchase an item  
GET/purchases/products -> get all single item purchases  
GET/purchases/products/{id} -> get a specific single item purchase  

POST/purchases/shopping-carts -> purchase the items in a shopping cart  
GET/purchases/shopping-carts -> get all shopping cart purchases  
GET/purchases/shopping-carts/{id} -> get a specific shopping cart purchase  

-----------------------------------------------------------------------------------------------------------------------

POST/shopping-carts -> make a shopping-cart  
DELETE/shopping-carts/{id} -> delete a specific shopping cart  
GET/shopping-carts/{id} -> get a specific shopping cart  

POST/shopping-carts/{id}/products -> add item(s) to a specific shopping cart  
DELETE/shopping-carts/{id}/products -> delete item(s) from a specific shopping cart  
