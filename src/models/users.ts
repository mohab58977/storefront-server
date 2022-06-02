
import client from '../database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string
  
};
export type Userex = {
  user_id?: number;
  firstname: string;
  lastname: string;
  password?: string;

};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT user_id,firstname,lastname,password from users';
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
      const sql = 'delete from users WHERE user_id=$1 returning *;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rowCount;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
    
  }
  async update(u: User): Promise<User> {
    try {
      const conn = await client.connect();
        const sql = 'Insert into users(firstname,lastname,password) values($1,$2,$3) where id=$1 returning *;';

      const hash: string = bcrypt.hashSync(
        (u.password as string) + pepper,
        parseInt(rounds as string)
      );
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
  async checkcreate(u: User): Promise<User | null> {
    const conn = await client.connect();
    const sql = 'Select * from users where firstname=$1 AND lastname=$2';
    const result = await conn.query(sql, [u.firstname,u.lastname])

    if (result.rowCount) {
      const user = result.rows[0] as User;
      return user;
    }
    return null;
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'Insert into users(firstname,lastname,password) values($1,$2,$3) returning *;';

      const hash: string = bcrypt.hashSync(
        (u.password as string) + pepper,
        parseInt(rounds as string)
      );
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }

  async authenticate(
    firstname: string,
    lastname: string,
    password: string
  ): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = 'Select * from users where firstname=$1 AND lastname=$2';
      const result = await conn.query(sql, [firstname,lastname]);
      conn.release();

      if (result.rowCount) {
        const user = result.rows[0] as User;
        if (bcrypt.compareSync(password + pepper, user.password as string)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
}