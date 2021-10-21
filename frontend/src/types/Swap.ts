import CompleteTransaction from './CompleteTransaction';
import TransactionReq from './TransactionReq';

declare type Swap = {
  txId: string;
  status: number;
  transactions: CompleteTransaction[];
};
export default Swap;
