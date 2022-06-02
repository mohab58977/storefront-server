import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/users';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth';


const userHandlers = (app: express.Application): void => {
  app.get('/users', auth, getAllUsers);
  app.get('/users/:id', auth, showUser);
    app.put('/users/:id', auth, update);
  app.post('/users/authenticate', authenticate);
  app.post('/users', createUser);
  app.delete('/users/:id', auth, deleteUser);
};

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

//mimic database, this will reset when we reset the server
let userStore: UserStore = new UserStore();


//get all users
const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userStore.index();
    res.json(users);
  } catch (err) {
    res.sendStatus(500);
  }
};

const showUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (id === undefined) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }

    const user: User = await userStore.read(id);

    res.json(user);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const firstname = req.body.firstname as unknown as string;
    const lastname = req.body.lastname as unknown as string;
   const password = req.body.password as unknown as string;
    console.log(id, firstname, lastname, password);
    if (
      firstname === undefined ||
      lastname === undefined ||
      password === undefined ||
      id === undefined
    ) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :firstname, :lastname, :id'
      );
      return false;
    }
   const useritem: User = {
              firstname:firstname,
              lastname: lastname,
              password: password,
            }
  
    const updateduser: User = await userStore.update(id, useritem);
    const token = jwt.sign(
           {
             user: {
               firstname: updateduser.firstname,
               lastname: updateduser.lastname,
               id: updateduser.id,
             },
           },
           tokenSecret as string,
           {
             expiresIn: '500m', // expires in 500 minutes
           }
         );
         const usertoken = {
           ...updateduser,
           token
         }
        
  

    res.json(usertoken);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;

   
  if (
    firstname &&
    typeof firstname === 'string' &&
    lastname &&
    typeof lastname === 'string' &&
    password &&
    typeof password === 'string'
  ) {
    try {
      const useritem: User = {
        firstname: firstname,
        lastname: lastname,
        password: password
      };
      const user = await userStore.authenticate(useritem);

      if (user) {
        const token = jwt.sign(
          {
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
              id: user.id,
            },
          },
          tokenSecret as string,
          {
            expiresIn: '500m', // expires in 500m
          }
        );
        res.json(token);
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(400).send('bad request');
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
   const firstname = req.body.firstname;
   const lastname = req.body.lastname;
   const password = req.body.password;

   if (
     firstname &&
     typeof firstname === 'string' &&
     lastname &&
     typeof lastname === 'string' &&
     password &&
     typeof password === 'string'
   ) {
     try {
       const user: User = {
         firstname,
         lastname,
         password,
       };
       const checkcreate = await userStore.checkcreate(user);
       if (checkcreate !== null) {
         res.send('user already exists');
       } else {
         const newUser = await userStore.create(user);
         const token = jwt.sign(
           {
             user: {
               firstname: newUser.firstname,
               lastname: newUser.lastname,
               id: newUser.id,
             },
           },
           tokenSecret as string,
           {
             expiresIn: '500m', // expires in 500 minutes
           }
         );
         const usertoken = {
           ...newUser,
           token
         }
         res.json(usertoken);
       }
     } catch (err) {
       res.sendStatus(500);
     }
   } else {
     res.status(400).send('bad request');
   }
};
//delete a resouce
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const deleted: number | undefined = await userStore.delete(id);
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



export default userHandlers;
