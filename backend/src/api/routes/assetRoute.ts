import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import AssetService from '../../services/AssetService';

const route = Router();

export default (app: Router) => {
  app.use('/asset', route);

  route.post('/get', async (req: Request<{ parent: string }>, res: Response) => {
    try {
      const EM = getManager();
      const swapService = new AssetService();
      const ret = await swapService.getMany(req.body);
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });
};
