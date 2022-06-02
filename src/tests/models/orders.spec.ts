import { Order, Orderex, OrderStore} from "../../models/orders"
import {Userex, UserStore} from "../../models/users"
import {Product, Productex, ProductStore} from "../../models/products"


const OrderStoreInstance = new OrderStore()

describe('Order Model', () => {
  const UserStoreInstance = new UserStore();
  const ProductStoreInstance = new ProductStore();

  let order: Order, user_id: number, product_id: number;

  async function createOrder(order: Order) {
    return OrderStoreInstance.create(order);
  }

  async function deleteOrder(id: number) {
    return OrderStoreInstance.delete(id);
  }

  beforeAll(async () => {
    const user: Userex = await UserStoreInstance.create({
      firstname: 'Hans',
      lastname: 'Meier',
      password: 'password123',
    });

    user_id = user.user_id!;
    const local: unknown = 99;
    const product: Productex = await ProductStoreInstance.create({
      name: 'OrderSpec Product',
      price: local as string,
    });

    product_id = product.product_id!;

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
      const createdOrder: Order = await createOrder(order);

      expect(createdOrder).toEqual({
        id: createdOrder.id,
        ...order,
      });
      await deleteOrder(createdOrder.id!);
    });

    it('index method should return a list of orders', async () => {
      const createdOrder: Order = await createOrder(order);
      const orderList = await OrderStoreInstance.index();

      expect(orderList).toEqual([createdOrder]);

      await deleteOrder(createdOrder.id!);
    });

    it('show method should return the correct orders', async () => {
      const createdOrder: Order = await createOrder(order);
      const orderFromDb: Order = await OrderStoreInstance.show(
        createdOrder.id!
      );

      expect(orderFromDb).toEqual(createdOrder);

      await deleteOrder(createdOrder.id!);
    });
  it('showforuser method should return the correct orders', async () => {
    const createdOrder: Order = await createOrder(order);
    const orderFromDb = await OrderStoreInstance.showforuser(createdOrder.userid);

    expect(orderFromDb).toEqual([createdOrder]);

    await deleteOrder(createdOrder.id!);
  });
   
    it('delete method should remove the order', async () => {
      const createdOrder: Order = await createOrder(order);

      await deleteOrder(createdOrder.id!);

      const orderList = await OrderStoreInstance.index();

      expect(orderList).toEqual([]);
    });
  });
