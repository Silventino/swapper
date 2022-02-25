import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import AssetService from '../../services/AssetService';

const route = Router();

export default (app: Router) => {
  app.use('/asset', route);

  route.post('/get', async (req: Request<{ parent: string }>, res: Response) => {
    try {
      // const EM = getManager();
      const assetService = new AssetService();
      const ret = await assetService.getMany(req.body);
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  // route.post('/checkIsVerifiedNft', async (req: Request<{ parent: string }>, res: Response) => {
  //   try {
  //     // const EM = getManager();
  //     const assetService = new AssetService();
  //     const ret = await assetService.checkIsVerifiedNft(req.body.assetId);
  //     return res.json(ret).status(200);
  //   } catch (error: any) {
  //     return res.status(error.statusCode || 500).send(error.message);
  //   }
  // });
};
