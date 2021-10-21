import { EntityManager, getManager } from 'typeorm';
import { STATUS_COMPLETED, STATUS_DEAD } from '../constants';
import Swap from '../db/entity/Swap';
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

  async getSwap(parent: string) {
    const swapModel = this.EM.getRepository(Swap);
    const swap = await swapModel.findOne({ where: { txId: parent }, relations: ['transactions'] });

    if (!swap) {
      throw new HttpError(404, 'Swap not found.');
    }
    const canRead = swap.transactions.some(
      (item) => item.from === this.connectedWallet || item.to === this.connectedWallet
    );
    if (!canRead) {
      throw new HttpError(400, 'Selected wallet is not participating in this swap.');
    }
    return swap;
  }

  async insertSwap(transactions: TransactionReq[], parent: string) {
    const transactionModel = this.EM.getRepository(Transaction);
    const swapModel = this.EM.getRepository(Swap);
    await swapModel.insert({ txId: parent });
    for (let i = 0; i < transactions.length; i++) {
      const untreated = transactions[i];
      const treated = new Transaction();
      treated.fromTransactionReq(untreated, parent);
      await transactionModel.insert(treated);
    }
    return await this.getSwap(parent);
  }

  async updateTransaction(id: number, update: Partial<TransactionReq>) {
    const transactionModel = this.EM.getRepository(Transaction);
    await transactionModel.update(id, {
      blob: update.blob,
      txID: update.txID
    });
  }

  async completeSwap(txId: number) {
    const swapModel = this.EM.getRepository(Swap);
    await swapModel.update(txId, { status: STATUS_COMPLETED });
  }

  async killSwap(txId: number) {
    const swapModel = this.EM.getRepository(Swap);
    await swapModel.update(txId, { status: STATUS_DEAD });
  }
}
