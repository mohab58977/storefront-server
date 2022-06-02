
import client from '../database';
import dotenv from 'dotenv';
dotenv.config();

const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;

export type Product = {
  id?: number;
  name: string;
  price?: string;
};
export type Productex = {
  product_id?: number;
  name: string;
  price?: string;
};
export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT product_id,name,price from Products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const conn = await client.connect();
      const sql = 'delete from Products WHERE product_id=$1 returning *;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rowCount;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }

  async create(u: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'Insert into Products(name,price) values($1,$2) returning *;';

      const result = await conn.query(sql, [u.name, u.price]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
  async checkcreate(u: Product): Promise<Product | null> {
    const conn = await client.connect();
    const sql = 'Select * from Products where name=$1 AND price=$2';
    const result = await conn.query(sql, [u.name,u.price]);
    conn.release();

    if (result.rowCount) {
      const Product = result.rows[0] as Product;
      return Product;
    }
    return null;
  }
  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from Products WHERE product_id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
}

