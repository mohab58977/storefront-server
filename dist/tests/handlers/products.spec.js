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
describe("Product Handler", () => {
    const product = {
        name: 'CodeMaster 3000',
        price: '999',
    };
    let token, userId, productId;
    beforeAll(async () => {
        const userData = {
            firstname: 'Produkt',
            lastname: 'Tester',
            password: 'password123',
        };
        const { body } = await request.post('/users').send(userData);
        token = body.token;
        // @ts-ignore
        const user = jsonwebtoken_1.default.verify(token, SECRET);
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
            const status = res.status;
            const prod = res.body;
            expect(status).toBe(200);
            productId = prod.product_id;
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
});
