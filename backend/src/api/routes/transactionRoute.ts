import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import TransactionService from '../../services/TransactionService';
import TransactionReq from '../../types/TransactionReq';
import isAuth from '../middlewares/isAuth';

const route = Router();

type InsertTransaction = {
  parent: string;
  transactions: TransactionReq[];
};

export default (app: Router) => {
  app.use('/transaction', route);

  route.post('/get', isAuth(), async (req: Request<{ parent: string }>, res: Response) => {
    try {
      const EM = getManager();
      const transactionService = new TransactionService(EM, req.body.wallet);
      const ret = await transactionService.getAtomicTransaction(req.body.parent);
      return res.json(ret).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/insert', isAuth(), async (req: Request, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const transactionService = new TransactionService(EM, req.body.wallet);
        return await transactionService.insertAtomicTransaction(req.body.transactions, req.body.parent);
      });
      return res.json(ret).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/sign', isAuth(), async (req: Request, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const transactionService = new TransactionService(EM, req.body.wallet);
        return await transactionService.updateTransaction(req.body.id, req.body.update);
      });
      return res.json(ret).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });
};
