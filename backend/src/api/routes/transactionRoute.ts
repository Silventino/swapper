import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import SwapService from '../../services/SwapService';
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  app.use('/transaction', route);

  route.post('/get', isAuth(), async (req: Request<{ parent: string }>, res: Response) => {
    try {
      const EM = getManager();
      const swapService = new SwapService(EM, req.body.wallet);
      const ret = await swapService.getSwap(req.body.parent);
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/insert', isAuth(), async (req: Request, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const swapService = new SwapService(EM, req.body.wallet);
        return await swapService.insertSwap(req.body.transactions, req.body.parent);
      });
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/sign', isAuth(), async (req: Request, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const swapService = new SwapService(EM, req.body.wallet);
        return await swapService.updateTransaction(req.body.id, req.body.update);
      });
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/complete', isAuth(), async (req: Request, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const swapService = new SwapService(EM, req.body.wallet);
        return await swapService.completeSwap(req.body.txId);
      });
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/kill', isAuth(), async (req: Request, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const swapService = new SwapService(EM, req.body.wallet);
        return await swapService.killSwap(req.body.txId);
      });
      return res.json(ret).status(200);
    } catch (error: any) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });
};
