import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import cors from 'cors';

//conseguir la ruta relativa de nuestra aplicación (__dirname)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rutas de los endpoints
import paymentRoutes from "./modules/payment/payment.routes.js";
import adminRouter from './modules/admin/admin.routes.js';
import categoriesRouter from './modules/categories/categories.routes.js';
import usersRouter from './modules/users/users.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import salesRoutes from './modules/sales/sales.routes.js';
import beehivesRoutes from './modules/beehives/beehive.routes.js';
import sponsorshipsRoutes from './modules/sponsorships/sponsorships.routes.js';

const app = express();

//middlewares

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use("/payment", paymentRoutes);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRoutes);
app.use('/sales', salesRoutes);
app.use('/beehives', beehivesRoutes);
app.use('/sponsorships', sponsorshipsRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

export default app;
