import { TransactionLike } from 'algosdk';
import axios from 'axios';
import { fromCompleteTransaction } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import TransactionReq from 'src/types/TransactionReq';
import myAxios from './myAxios';

const PREFIX = 'api';
const ROUTE = 'transaction';

class TransactionApi {
  async getAtomicTransaction(parent: string) {
    try {
      let res = await myAxios.post(`/${PREFIX}/${ROUTE}/get`, { params: parent });
      let data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertAtomicTransaction(transactions: CompleteTransaction[], parent: string) {
    try {
      const treated = transactions.map((item) => fromCompleteTransaction(item));
      let res = await myAxios.post(`/${PREFIX}/${ROUTE}/insert`, { transactions: treated, parent });
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
