import { Product, Productex, ProductStore} from "../../models/products"

const ProductStoreInstance = new ProductStore()

describe("Product Model", () => {
  const newLocal: unknown = 2000;
  const product: Product = {
    name: 'CodeMaster 3000',
    price : newLocal as string
  };

  async function createProduct(product: Product): Promise<Product> {
    return ProductStoreInstance.create(product);
  }

  async function deleteProduct(id: number) {
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
    const createdProduct: Productex = await createProduct(product);

    expect(createdProduct).toEqual({
     product_id : createdProduct.product_id,
      ...product,
    });

    await deleteProduct(createdProduct.product_id!);
  });

  it('index method should return a list of products', async () => {
    const createdProduct: Productex = await createProduct(product);
    const productList : Productex[]= await ProductStoreInstance.index();

    expect(productList).toEqual([createdProduct]);

    await deleteProduct(createdProduct.product_id!);
  });

  it('show method should return the correct product', async () => {
    const createdProduct: Productex = await createProduct(product);
    const productFromDb : Productex= await ProductStoreInstance.show(createdProduct.product_id!);

    expect(productFromDb).toEqual(createdProduct);

    await deleteProduct(createdProduct.product_id!);
  });


  it('delete method should remove the product', async () => {
    const createdProduct: Productex = await createProduct(product);

    await deleteProduct(createdProduct.product_id!);

    const productList = await ProductStoreInstance.index();

    expect(productList).toEqual([]);
  });
})
