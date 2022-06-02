# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `/products` [GET]
- Create `/products` [POST] [token required]
- show `/products/:id` [GET]
- Delete `/products/:id` [DELETE] [token required]

#### Users
- Index `/users` [GET] [token required]
- Create `/users` [POST] 
- show `/users/:id` [GET] [token required]
- Delete `/users/:id` [DELETE] [token required]
- Auth `/users/authenticate` [POST]

#### Orders
- Index `/orders` [GET] [token required]
- Create `/orders` [POST] [token required]
- show `/orders/:id` [GET] [token required]
- showforuser `/orders/userorders/:id` [GET] [token required]
- Delete `/orders/:id` [DELETE] [token required]

## Data Shapes
#### Product
Table: *products*
- product_id `SERIAL PRIMARY KEY`
- name `VARCHAR`
- price `INTEGER`

#### User
Table: *users*
- firstname `VARCHAR`
- lastname `VARCHAR`
- password `VARCHAR`

#### Orders
Table: *orders*
- id `SERIAL PRIMARY KEY`
- user_id `serial` `REFERENCES users(id)`
- status `enum`

Table: *orderproducts*
- orderid `serial` `REFERENCES orders(id)` 
- userid `serial` `REFERENCES users(user_id)` 
- productid `serial` `REFERENCES products(product_id)`
- quantity `INTEGER`
