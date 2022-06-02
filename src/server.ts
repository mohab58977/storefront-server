import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import userHandlers from './routes/usersRoutes';
import productHandlers from './routes/productsRoutes';
import ordersHandlers from './routes/ordersRoutes';
import cors from 'cors';

const app: Application = express();
const port: number = 3000;

//app.use a list of your custom middlewares
// enable cors
const corsOption = {
  optionsSuccessStatus: 200 // for some lagacy browsers
};
app.use(cors(corsOption));
// add json parser
app.use(morgan('tiny'));
app.use(express.json());

//app.use routes takes url and routes object. now to access routes root url you need to access /api

userHandlers(app);
productHandlers(app);
ordersHandlers(app);
//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (_req: Request, res: Response): Promise<void> => {
  res.send('posts app root route');
});

//use this function to map your app to a port
app.listen(port, () => {
  console.log('server started on port: ' + port);
});

export default app;


