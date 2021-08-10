import { EntityManager, getManager } from 'typeorm';
import Transaction from '../db/entity/Transaction';
import TransactionReq from '../types/TransactionReq';

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

  async insertAtomicTransaction(transactions: TransactionReq[], parent: string) {
    // console.log('FLAG 1', transactions);
    const transactionModel = this.EM.getRepository(Transaction);
    for (let i = 0; i < transactions.length; i++) {
      // console.log('FLAG 2');
      const untreated = transactions[i];
      const treated = new Transaction();
      // console.log('FLAG 3');
      treated.fromTransactionReq(untreated, parent);
      // console.log('FLAG 4');
      await transactionModel.insert(treated);
      // console.log('FLAG 5');
    }
    return await this.getAtomicTransaction(parent);
  }
}
