"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../../models/orders");
const users_1 = require("../../models/users");
const products_1 = require("../../models/products");
const OrderStoreInstance = new orders_1.OrderStore();
describe('Order Model', () => {
    const UserStoreInstance = new users_1.UserStore();
    const ProductStoreInstance = new products_1.ProductStore();
    let order, user_id, product_id;
    async function createOrder(order) {
        return OrderStoreInstance.create(order);
    }
    async function deleteOrder(id) {
        return OrderStoreInstance.delete(id);
    }
    beforeAll(async () => {
        const user = await UserStoreInstance.create({
            firstname: 'Hans',
            lastname: 'Meier',
            password: 'password123',
        });
        user_id = user.user_id;
        const local = 99;
        const product = await ProductStoreInstance.create({
            name: 'OrderSpec Product',
            price: local,
        });
        product_id = product.product_id;
        order = {
            userid: user_id,
            orderproducts: [
                {
                    productid: product_id,
                    quantity: 5,
                },
            ],
            status: 'active',
        };
    });
    afterAll(async () => {
        await UserStoreInstance.delete(user_id);
        await ProductStoreInstance.delete(product_id);
    });
    it('should have an index method', () => {
        expect(OrderStoreInstance.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(OrderStoreInstance.show).toBeDefined();
    });
    it('should have a add method', () => {
        expect(OrderStoreInstance.create).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(OrderStoreInstance.delete).toBeDefined();
    });
    it('add method should add a order', async () => {
        const createdOrder = await createOrder(order);
        expect(createdOrder).toEqual({
            id: createdOrder.id,
            ...order,
        });
        await deleteOrder(createdOrder.id);
    });
    it('index method should return a list of orders', async () => {
        const createdOrder = await createOrder(order);
        const orderList = await OrderStoreInstance.index();
        expect(orderList).toEqual([createdOrder]);
        await deleteOrder(createdOrder.id);
    });
    it('show method should return the correct orders', async () => {
        const createdOrder = await createOrder(order);
        const orderFromDb = await OrderStoreInstance.show(createdOrder.id);
        expect(orderFromDb).toEqual(createdOrder);
        await deleteOrder(createdOrder.id);
    });
    it('showforuser method should return the correct orders', async () => {
        const createdOrder = await createOrder(order);
        const orderFromDb = await OrderStoreInstance.showforuser(createdOrder.userid);
        expect(orderFromDb).toEqual([createdOrder]);
        await deleteOrder(createdOrder.id);
    });
    it('delete method should remove the order', async () => {
        const createdOrder = await createOrder(order);
        await deleteOrder(createdOrder.id);
        const orderList = await OrderStoreInstance.index();
        expect(orderList).toEqual([]);
    });
});
