import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
import dotenv from 'dotenv';
import auth from '../middleware/auth';

const productHandlers = (app: express.Application): void => {
  app.get('/Products', getAllProducts);
  app.post('/Products', auth, createProduct);
  app.get('/Products/:id', showProduct);
  app.delete('/Products/:id', deleteProduct);
};

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

//mimic database, this will reset when we reset the server
let productStore: ProductStore = new ProductStore();

//get all products
const getAllProducts  = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await productStore.index();
    res.json(products);
  } catch (err) {
    res.sendStatus(500);
  }
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
  const name = req.body.name;
  const price = req.body.price;
 
  if (name && typeof name === 'string' && price && typeof price === 'string') {
    try {
      const product: Product = {
        name,
        price,
      };
       const checkcreate = await productStore.checkcreate(product);
      if (checkcreate !== null) {
        res.send('product already exists');
       } else {
      const newproduct = await productStore.create(product);
    
      res.json(newproduct);
       }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(400).send('bad request');
  }
};
      const showProduct = async (req: Request, res: Response): Promise<void> => {
        const id: number = parseInt(req.params.id as string);
        if (id) {
          try {
            const product: Product | undefined = await productStore.show(id);
            if (product) {
              res.json(product);
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

      const deleteProduct = async (req: Request, res: Response): Promise<void> => {
        const id: number  = parseInt(req.params.id as string);
       
        if (id) {
          try {
            const deleted: number | undefined = await productStore.delete(id);
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
      
      
    
      export default productHandlers;
