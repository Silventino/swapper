import { fromCompleteTransaction, toCompleteTransaction } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import Swap from 'src/types/Swap';
import SwapReq from 'src/types/SwapReq';
import myAxios, { getConnectedWallet } from './myAxios';

const PREFIX = 'api';
const ROUTE = 'transaction';

class SwapApi {
  async getSwap( parent: string) {
    try {
      const myWallet = getConnectedWallet();
      const res = await myAxios.post<SwapReq>(
        `/${PREFIX}/${ROUTE}/get`,
        { parent },
        { headers: { Authorization: myWallet } }
      );
      const swapReq = res.data;

      const swap: Swap = {
        txId: swapReq.txId,
        status: swapReq.status,
        transactions: []
      };
      swap.transactions = swapReq.transactions.map((item) => toCompleteTransaction(item));

      return swap;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertSwap( transactions: CompleteTransaction[], parent: string) {
    try {
      const myWallet = getConnectedWallet();
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

  async signTransaction( signed: CompleteTransaction) {
    try {
      const myWallet = getConnectedWallet();
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

  async completeSwap( txId: string) {
    try {
      const myWallet = getConnectedWallet();
      let res = await myAxios.post(`/${PREFIX}/${ROUTE}/complete`, { txId }, { headers: { Authorization: myWallet } });
      let data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async killSwap( txId: string) {
    try {
      const myWallet = getConnectedWallet();
      let res = await myAxios.post(`/${PREFIX}/${ROUTE}/kill`, { txId }, { headers: { Authorization: myWallet } });
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
