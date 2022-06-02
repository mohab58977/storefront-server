"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../../models/products");
const ProductStoreInstance = new products_1.ProductStore();
describe("Product Model", () => {
    const newLocal = 2000;
    const product = {
        name: 'CodeMaster 3000',
        price: newLocal
    };
    async function createProduct(product) {
        return ProductStoreInstance.create(product);
    }
    async function deleteProduct(id) {
        return ProductStoreInstance.delete(id);
    }
    it('should have an index method', () => {
        expect(ProductStoreInstance.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(ProductStoreInstance.show).toBeDefined();
    });
    it('should have an add method', () => {
        expect(ProductStoreInstance.create).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(ProductStoreInstance.delete).toBeDefined();
    });
    it('add method should add a product', async () => {
        const createdProduct = await createProduct(product);
        expect(createdProduct).toEqual({
            product_id: createdProduct.product_id,
            ...product,
        });
        await deleteProduct(createdProduct.product_id);
    });
    it('index method should return a list of products', async () => {
        const createdProduct = await createProduct(product);
        const productList = await ProductStoreInstance.index();
        expect(productList).toEqual([createdProduct]);
        await deleteProduct(createdProduct.product_id);
    });
    it('show method should return the correct product', async () => {
        const createdProduct = await createProduct(product);
        const productFromDb = await ProductStoreInstance.show(createdProduct.product_id);
        expect(productFromDb).toEqual(createdProduct);
        await deleteProduct(createdProduct.product_id);
    });
    it('delete method should remove the product', async () => {
        const createdProduct = await createProduct(product);
        await deleteProduct(createdProduct.product_id);
        const productList = await ProductStoreInstance.index();
        expect(productList).toEqual([]);
    });
});
