import { fromCompleteTransaction, toCompleteTransaction } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import Swap from 'src/types/Swap';
import SwapReq from 'src/types/SwapReq';
import myAxios from './myAxios';

const PREFIX = 'api';
const ROUTE = 'transaction';

class SwapApi {
  async getSwap(myWallet: string, parent: string) {
    try {
      if (!myWallet) {
        throw new Error('Please, connect your wallet first.');
      }
      const res = await myAxios.post<SwapReq>(
        `/${PREFIX}/${ROUTE}/get`,
        { parent },
        { headers: { Authorization: myWallet } }
      );
      const swapReq = res.data;

      const swap: Swap = {
        txId: swapReq.txId,
        completed: swapReq.completed,
        transactions: []
      };
      swap.transactions = swapReq.transactions.map((item) => toCompleteTransaction(item));

      return swap;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertSwap(myWallet: string, transactions: CompleteTransaction[], parent: string) {
    try {
      if (!myWallet) {
        throw new Error('Please, connect your wallet first.');
      }
      const treated = transactions.map((item) => fromCompleteTransaction(item));
      let res = await myAxios.post(
        `/${PREFIX}/${ROUTE}/insert`,
        { transactions: treated, parent },
        { headers: { Authorization: myWallet } }
      );
      let data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signTransaction(myWallet: string, signed: CompleteTransaction) {
    try {
      if (!myWallet) {
        throw new Error('Please, connect your wallet first.');
      }
      const treated = fromCompleteTransaction(signed);
      let res = await myAxios.post(
        `/${PREFIX}/${ROUTE}/sign`,
        { id: treated.id, update: { blob: treated.blob, txID: treated.txID } },
        { headers: { Authorization: myWallet } }
      );
      let data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async completeSwap(myWallet: string, txId: string) {
    try {
      if (!myWallet) {
        throw new Error('Please, connect your wallet first.');
      }

      let res = await myAxios.post(`/${PREFIX}/${ROUTE}/complete`, { txId }, { headers: { Authorization: myWallet } });
      let data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const swapApi = new SwapApi();
export default swapApi;