"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
//app.use a list of your custom middlewares
// enable cors
const corsOption = {
    optionsSuccessStatus: 200 // for some lagacy browsers
};
app.use((0, cors_1.default)(corsOption));
// add json parser
app.use((0, morgan_1.default)('tiny'));
app.use(express_1.default.json());
//app.use routes takes url and routes object. now to access routes root url you need to access /api
(0, usersRoutes_1.default)(app);
(0, productsRoutes_1.default)(app);
(0, ordersRoutes_1.default)(app);
//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (_req, res) => {
    res.send('posts app root route');
});
//use this function to map your app to a port
app.listen(port, () => {
    console.log('server started on port: ' + port);
});
exports.default = app;
