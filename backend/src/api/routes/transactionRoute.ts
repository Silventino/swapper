import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import TransactionService from '../../services/TransactionService';
import TransactionReq from '../../types/TransactionReq';

const route = Router();

type InsertTransaction = {
  parent: string;
  transactions: TransactionReq[];
};

export default (app: Router) => {
  app.use('/transaction', route);

  route.post('/get', async (req: Request<{ parent: string }>, res: Response) => {
    try {
      const EM = getManager();
      const transactionService = new TransactionService(EM);
      const ret = await transactionService.getAtomicTransaction(req.body.parent);
      return res.json(ret).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.post('/insert', async (req: Request<InsertTransaction>, res: Response) => {
    try {
      const ret = await getManager().transaction(async (EM) => {
        const transactionService = new TransactionService(EM);
        return await transactionService.insertAtomicTransaction(req.body.transactions, req.body.parent);
      });
      return res.json(ret).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });
};
