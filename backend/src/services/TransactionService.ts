import { EntityManager, getManager } from 'typeorm';
import Transaction from '../db/entity/Transaction';
import SimpleTransaction from '../types/SimpleTransaction';

export default class TransactionService {
  EM: EntityManager;

  constructor(EM: EntityManager) {
    this.EM = EM;
  }

  async getAtomicTransaction(parent: string) {
    const transactionModel = this.EM.getRepository(Transaction);
    const transactions = await transactionModel.find({ where: { parentTransaction: parent } });
    return transactions;
  }

  async insertAtomicTransaction(transactions: SimpleTransaction[], parent: string) {
    const transactionModel = this.EM.getRepository(Transaction);
    for (let i = 0; i < transactions.length; i++) {
      const untreated = transactions[i];
      const treated = new Transaction();
      treated.fromSimpleTransaction(untreated, parent);
      transactionModel.insert(treated);
    }
  }
}
