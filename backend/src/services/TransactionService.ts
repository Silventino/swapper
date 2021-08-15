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
    const transactionModel = this.EM.getRepository(Transaction);
    for (let i = 0; i < transactions.length; i++) {
      const untreated = transactions[i];
      const treated = new Transaction();
      treated.fromTransactionReq(untreated, parent);
      await transactionModel.insert(treated);
    }
    return await this.getAtomicTransaction(parent);
  }

  async updateTransaction(id: number, update: Partial<TransactionReq>) {
    const transactionModel = this.EM.getRepository(Transaction);
    transactionModel.update(id, {
      blob: update.blob,
      txID: update.txID
    });
  }
}
