import { fromCompleteTransaction, toCompleteTransaction } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import TransactionReq from 'src/types/TransactionReq';
import myAxios from './myAxios';

const PREFIX = 'api';
const ROUTE = 'transaction';

class TransactionApi {
  async getAtomicTransaction(myWallet: string, parent: string) {
    try {
      if (!myWallet) {
        throw new Error('Please, connect your wallet first.');
      }
      const res = await myAxios.post<TransactionReq[]>(
        `/${PREFIX}/${ROUTE}/get`,
        { parent },
        { headers: { Authorization: myWallet } }
      );
      const data = res.data;
      const ret = data.map((item) => toCompleteTransaction(item));
      return ret;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertAtomicTransaction(myWallet: string, transactions: CompleteTransaction[], parent: string) {
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
}

const transactionApi = new TransactionApi();
export default transactionApi;
