import { Router } from 'express';
import transactionRoute from './routes/transactionRoute';

export default () => {
  const app = Router();
  transactionRoute(app);

  return app;
};
