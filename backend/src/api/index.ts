import { Router } from 'express';
import assetRoute from './routes/assetRoute';
import swapRoute from './routes/swapRoute';
import transactionRoute from './routes/transactionRoute';

export default () => {
  const app = Router();
  swapRoute(app);
  assetRoute(app);
  transactionRoute(app);

  return app;
};
