import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';
import TransactionService from '../../services/TransactionService';
import SimpleTransaction from '../../types/SimpleTransaction';

const route = Router();

type InsertTransaction = {
  parent: string;
  transactions: SimpleTransaction[];
};

export default (app: Router) => {
  app.use('/transaction', route);

  route.post('/get', async (req: Request<{ parent: string }>, res: Response) => {
    try {
      const EM = getManager();
      const transactionService = new TransactionService(EM);
      transactionService.getAtomicTransaction(req.body.parent);
    } catch (err) {}
  });

  route.post('/insert', async (req: Request<InsertTransaction>, res: Response) => {
    try {
      await getManager().transaction(async (EM) => {
        const transactionService = new TransactionService(EM);
        transactionService.insertAtomicTransaction(req.body.transactions, req.body.parent);
      });
      return res.json({ ok: true }).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });
};
