import { EntityManager, getManager } from 'typeorm';
import Transaction from '../db/entity/Transaction';
import HttpError from '../etc/HttpError';
import TransactionReq from '../types/TransactionReq';

export default class TransactionService {
  EM: EntityManager;
  connectedWallet: string;

  constructor(EM: EntityManager, connectedWallet: string) {
    this.EM = EM;
    this.connectedWallet = connectedWallet;
  }

  async getAtomicTransaction(parent: string) {
    const transactionModel = this.EM.getRepository(Transaction);
    const transactions = await transactionModel.find({ where: { parentTransaction: parent } });
    const canRead = transactions.some((item) => item.from === this.connectedWallet || item.to === this.connectedWallet);
    if (!canRead) {
      throw new HttpError(400, 'Selected wallet is not participating in this swap.');
    }
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
