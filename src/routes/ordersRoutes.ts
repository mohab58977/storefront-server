import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import dotenv from 'dotenv';

import auth from '../middleware/auth';



const orderHandlers = (app: express.Application): void => {
  app.get('/orders', auth, getAllorders);
  app.post('/orders', auth, createorder);
  app.get('/orders/:id', auth, showorder);
  app.get('/orders/userorders/:userid', auth, showuserorders);
  app.delete('/orders/:id', auth, deleteorder);
};


dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

//mimic database, this will reset when we reset the server
let orderStore: OrderStore = new OrderStore();

//get all orders
const getAllorders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderStore.index();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const createorder = async (req: Request, res: Response): Promise<void> => {
  const userid = req.body.userid;
  const orderproducts = req.body.orderproducts;
  const status = req.body.status;
  console.log(userid, orderproducts);
  console.log( orderproducts.length);
  if (
    (userid &&
      typeof userid === 'string' &&
      orderproducts &&
      typeof orderproducts === 'object' &&

      status &&
      typeof status === 'string' &&
      status === 'active'||'complete')
  ) {
    try {
       
    const order: Order = {
        userid,
        orderproducts,
        status
    };

        const neworder = await orderStore.create(order);

        res.json(neworder); 
   
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(400).send('bad request'); 
  }
};
const showorder = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  console.log(id);
  if (id) {
    try {
      const order: Order| undefined = await orderStore.show(id);
      if (order) {
        res.json(order);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
const showuserorders = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.userid as string);
  console.log(id);
  if (id) {
    try {
      const orders: Order[] | undefined = await orderStore.showforuser(id);
      if (orders) {
        res.json(orders);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};

const deleteorder = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  console.log(id);
  if (id) {
    try {
      const deleted: number | undefined = await orderStore.delete(id);
      if (deleted) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
//delete a resouce



export default orderHandlers;
