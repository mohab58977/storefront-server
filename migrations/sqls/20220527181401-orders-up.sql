
CREATE TYPE  order_status AS ENUM('active','complete');

CREATE TABLE orders (
id serial primary key ,
userid serial ,
status order_status,
CONSTRAINT fk_user
      FOREIGN KEY(userid) 
	  REFERENCES users(user_id) ON DELETE CASCADE
      ) ;
      