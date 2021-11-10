import { Router } from 'express';
import assetRoute from './routes/assetRoute';
import swapRoute from './routes/swapRoute';

export default () => {
  const app = Router();
  swapRoute(app);
  assetRoute(app);

  return app;
};
