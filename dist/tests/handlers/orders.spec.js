"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = __importDefault(require("../../server"));
const request = (0, supertest_1.default)(server_1.default);
const SECRET = process.env.TOKEN_SECRET;
describe('Order Handler', () => {
    let token, order, user_id, product_id, order_id, status;
    beforeAll(async () => {
        const userData = {
            firstname: 'Order',
            lastname: 'Tester',
            password: 'password123',
        };
        const productData = {
            name: 'CodeMaster 199',
            price: '199',
        };
        const { body } = await request.post('/users').send(userData);
        token = body.token;
        // @ts-ignore
        const { user } = jsonwebtoken_1.default.verify(token, SECRET);
        user_id = body.user_id;
        const prod = await request
            .post('/products')
            .set('Authorization', `Bearer "${token}" `)
            .send(productData).then((res) => {
            const prod = res.body;
            product_id = prod.product_id;
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
            const body = res.body;
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
