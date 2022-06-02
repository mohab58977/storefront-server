import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import app from '../../server';
import { Order, Orderex, OrderStore } from '../../models/orders';
import { User, UserStore } from '../../models/users';
import { Product, Productex, ProductStore } from '../../models/products';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe('Order Handler', () => {
  let token: string,
    order: Order,
    user_id: number,
    product_id: number,
    order_id: number,
    status: string;

  beforeAll(async () => {
    const userData: User = {
      firstname: 'Order',
      lastname: 'Tester',
      password: 'password123',
    };
   
    const productData: Product = {
      name: 'CodeMaster 199',
      price: '199',
    };

    const { body } = await request.post('/users').send(userData);

    token = body.token;

    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = body.user_id;
    const prod = await request
      .post('/products')
      .set('Authorization', `Bearer "${token}" `)
      .send(productData).then((res) => {
        
        const prod : Productex = res.body;

        product_id = prod.product_id!;
  });
        
  

    order = {
      userid: user_id,
      orderproducts: [
        {
          productid: product_id,
          quantity: 3,
        },
      ],
      status: 'active',
    };
  });
    afterAll(async () => {
      await request
        .delete(`/users/${user_id}`)
        .set('Authorization', `Bearer "${token}" `);
      await request
        .delete(`/products/${product_id}`)
        .set('Authorization', `Bearer "${token}" `);
    });

    it('gets the create endpoint', (done) => {
      request
        .post('/orders')
        .send(order)
        .set('Authorization', `Bearer "${token}" `)
        .then((res) => {
          const { status } = res;
          const body: Orderex = res.body;
           order_id = body.id;


          expect(status).toBe(200);

          done();
        });
    });

    it('gets the index endpoint', (done) => {
      request
        .get('/orders')
        .set('Authorization', `Bearer "${token}" `)
        .then((res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('gets the show endpoint', (done) => {
      request
        .get(`/orders/${order_id}`)
        .set('Authorization', `Bearer "${token}" `)
        .then((res) => {
          expect(res.status).toBe(200);
          done();
        });
    });
   it('gets the showforuser endpoint', (done) => {
     request
       .get(`/orders/userorders/${user_id}`)
       .set('Authorization', `Bearer "${token}" `)
       .then((res) => {
         expect(res.status).toBe(200);
         done();
       });
   });
   
    it('gets the delete endpoint', (done) => {
      request
        .delete(`/orders/${order_id}`)
        .set('Authorization', `Bearer "${token}" `)
        .then((res) => {
          expect(res.status).toBe(200);
          done();
        });
    });
 
});
