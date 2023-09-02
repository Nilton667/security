import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
const app = express();
app.use(cors());

declare module 'express' {
  interface Response{
    locals: any
  }
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Home
import index from './routes/index'
app.use(index);

// Acess
import access from './config/jwt.access'
app.use(access);

// Login
import login from './routes/login'
app.use(login);

// Cadastro
import cadastro from './routes/cadastro'
app.use(cadastro);

// Recover
import recover from './routes/recover'
app.use(recover);

// Acess token
import token from './config/jwt.token'
app.use(token);

// Rotas protegidas
import perfil from './routes/perfil'
app.use(perfil)

import address from './routes/address'
app.use(address)

import card from './routes/card'
app.use(card)

import feedback from './routes/feedback'
app.use(feedback)

import historico from './routes/historico'
app.use(historico)

import session from './routes/session'
app.use(session)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: any, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
  res.render('error', {title: 'Server Error'})
});

export default app;