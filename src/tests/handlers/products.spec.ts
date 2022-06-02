import supertest from "supertest"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../server"
import {Product,Productex,ProductStore} from "../../models/products"
import {User,UserStore} from "../../models/users"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("Product Handler", () => {
  const product: Product = {
    name: 'CodeMaster 3000',
    price: '999',
  };

  let token: string, userId: number, productId: number;

  beforeAll(async () => {
    const userData: User = {
      firstname: 'Produkt',
      lastname: 'Tester',
      password: 'password123',
    };

    const { body } = await request.post('/users').send(userData);

    token = body.token;
    // @ts-ignore
    const user = jwt.verify(token, SECRET);
    userId = body.user_id;
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer "${token}" `);
  });

  it('gets the create endpoint', (done) => {
    request
      .post('/products')
      .send(product)
      .set('Authorization', `Bearer "${token}" `)
      .then((res) => {
        const status = res.status
        const prod : Productex = res.body;

        expect(status).toBe(200);

        productId = prod.product_id!;

        done();
      });
  });

  it('gets the index endpoint', (done) => {
    request.get('/products').then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it('gets the read endpoint', (done) => {
    
    request.get(`/products/${productId}`).then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });
 
  it('gets the delete endpoint', (done) => {
    request
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer "${token}" `)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
})
