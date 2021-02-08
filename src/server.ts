import 'reflect-metadata';

import express, { Request, NextFunction, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';

import routes from './routes/routes';
import uploadConfig from './config/uploads';
import AppError from './errors/AppError';

import './database/index';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server is running');
});
