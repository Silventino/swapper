import { TransactionLike } from 'algosdk';
import axios from 'axios';
import SimpleTransaction from 'src/types/SimpleTransaction';

const api = axios.create({ timeout: 30000 });

const PREFIX = 'api';
const ROUTE = 'transaction';

class TransactionApi {
  async getAtomicTransaction(parent: string) {
    try {
      let res = await api.get(`/${PREFIX}/${ROUTE}`, { params: parent });
      let data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertAtomicTransaction(transactions: TransactionLike[], parent: string) {
    try {
      let res = await api.post(`/${PREFIX}/${ROUTE}`, { transactions, parent });
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
