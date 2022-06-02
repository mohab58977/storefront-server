import client from '../database';
import dotenv from 'dotenv';


dotenv.config();

export type Orderproduct = {
  productid: number;
  quantity: number;
};
export type Order = {
  id?: number;
  userid: number;
  orderproducts: Orderproduct[];
  status: string;
};
export type Orderex = {
  id: number;
  userid: number;
  orderproducts: Orderproduct[];
  status: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'Select * from orders;';
      const orderProductsSql =
        'SELECT productid, quantity FROM orderproducts WHERE orderid=($1)';
      const orders = [];
      const { rows } = await conn.query(sql);
      for (const order of rows) {
        const { rows: orderProductRows } = await conn.query(orderProductsSql, [
          order.id,
        ]);
        orders.push({
          ...order,
          orderproducts: orderProductRows,
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      throw new Error();
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const conn = await client.connect();
      const sql = 'delete from orders WHERE id=$1 returning *;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rowCount;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }

  async create(u: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (userid, status) VALUES($1, $2) RETURNING *';
      const conn = await client.connect();
      const { rows } = await conn.query(sql, [u.userid, u.status]);
      const order = rows[0];

      const orderProductsSql =
        'INSERT INTO orderproducts (orderid,userid, productid, quantity) VALUES($1, $2, $3,$4) RETURNING productid, quantity';
      const orderProducts = [];

      for (const orderproduct of u.orderproducts) {
        const { productid, quantity } = orderproduct;

        const { rows } = await conn.query(orderProductsSql, [
          order.id,
          u.userid,
          productid,
          quantity,
        ]);

        orderProducts.push(rows[0]);
      }

      conn.release();

      return {
        ...order,
        orderproducts: orderProducts,
      };
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'Select * from orders where id=$1 ;';

      const orderProductsSql =
        'SELECT productid, quantity FROM orderproducts WHERE orderid=($1);';

      const { rows } = await conn.query(sql, [id]);
            const order = rows[0];


      const { rows: orderProductRows } = await conn.query(
        orderProductsSql,
        [id]
      );

      conn.release();

      return {
        ...order,
        orderproducts: orderProductRows,
      };

    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
  async showforuser(userid: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'Select * from orders where userid=$1 ;';

      const orderProductsSql =
        'SELECT productid, quantity FROM orderproducts WHERE userid=($1) AND orderid=($2);';
      const orders = [];
      const { rows } = await conn.query(sql, [userid]);
      for (const order of rows) {
        const { rows: orderProductRows } = await conn.query(orderProductsSql, [
          order.userid,
          order.id,
        ]);
        orders.push({
          ...order,
          orderproducts: orderProductRows
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
}
