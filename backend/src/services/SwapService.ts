import algosdk, { Account, TransactionLike } from 'algosdk';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import { EntityManager } from 'typeorm';
import { ALGO_ASSET, DONATION_ADDRESS, STATUS_COMPLETED, STATUS_DEAD, treatTransaction } from '../constants';
import Swap from '../db/entity/Swap';
import Transaction from '../db/entity/Transaction';
import HttpError from '../etc/HttpError';
import BaseTransaction from '../types/BaseTransaction';
import CompleteTransaction from '../types/CompleteTransaction';
import SwapData from '../types/SwapData';
import TransactionReq from '../types/TransactionReq';
import AssetService from './AssetService';

export default class TransactionService {
  EM: EntityManager;
  connectedWallet: string;

  algodClient: AlgodClient;
  swapperBank: Account;

  constructor(EM: EntityManager, connectedWallet: string) {
    this.EM = EM;
    this.connectedWallet = connectedWallet;

    const server = process.env.ALGOD_SERVER ?? '';
    const token = process.env.ALGOD_TOKEN ?? '';
    const port = process.env.ALGOD_PORT ?? '';

    this.algodClient = new algosdk.Algodv2({ 'X-API-Key': token }, server, port);

    const mnemonic = process.env.MNEMONIC ?? '';
    this.swapperBank = algosdk.mnemonicToSecretKey(mnemonic);
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

  ///////////////////////////////// new /////////////////////////////////////////////

  async getBaseTransaction() {
    let txn = (await this.algodClient.getTransactionParams().do()) as BaseTransaction;
    return txn;
  }

  async createSwap(data: SwapData) {
    try {
      const { transactions, creatorAddress, rounds, donation } = data;
      const baseTnx = await this.getBaseTransaction();
      baseTnx.lastRound = baseTnx.firstRound + rounds;

      const assetService = new AssetService();

      const newTransactions: CompleteTransaction[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];

        let assetInfo;
        if (!transaction.assetIndex) {
          assetInfo = ALGO_ASSET;
        } else {
          assetInfo = await assetService.getAssetInfo(transaction.assetIndex);
        }

        if (!assetInfo) {
          throw new Error('Asset not found.');
        }

        const txn: CompleteTransaction = {
          ...baseTnx,
          fee: 1000,
          flatFee: true,
          type: transaction.assetIndex === ALGO_ASSET.id ? 'pay' : 'axfer',
          assetIndex: transaction.assetIndex === ALGO_ASSET.id ? undefined : transaction.assetIndex,
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount * Math.pow(10, assetInfo.decimals)
        };
        newTransactions.push(txn);
      }

      // Group transactions
      let txgroup = algosdk.assignGroupID(newTransactions as TransactionLike[]);

      const groupID = txgroup[0].group;
      if (!groupID) {
        throw new Error('Error while creating the group ID.');
      }

      for (let i = 0; i < newTransactions.length; i++) {
        newTransactions[i].group = groupID;
      }

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        to: DONATION_ADDRESS,
        amount: 1,
        note: new Uint8Array(Buffer.from(JSON.stringify(groupID))),
        suggestedParams: {
          fee: 10,
          firstRound: baseTnx.firstRound,
          lastRound: baseTnx.lastRound,
          genesisHash: baseTnx.genesisHash,
          genesisID: baseTnx.genesisID
        }
      });

      // sign the transaction
      const signedTxn = txn.signTxn(this.swapperBank.sk);

      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

      const treatedTransactions = newTransactions.map((t) => treatTransaction(t));
      await this.insertSwap(treatedTransactions, txId);

      return `https://app.swapper.tools/tx/${txId}`;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }
}
