

CREATE TABLE orderproducts (
orderproductid serial primary key ,
productid serial,
userid serial,
orderid serial,
quantity INT not null ,
 CONSTRAINT fk_product
      FOREIGN KEY(productid) 
	  REFERENCES products(product_id)  ON update CASCADE ON DELETE CASCADE,
 CONSTRAINT fk_orders
      FOREIGN KEY(orderid) 
	  REFERENCES orders(id)  ON update CASCADE ON DELETE CASCADE,
 CONSTRAINT fk_users
      FOREIGN KEY(userid) 
	  REFERENCES users(user_id) ON update CASCADE ON DELETE CASCADE
      ) ;
      