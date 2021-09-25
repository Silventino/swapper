import CompleteTransaction from './CompleteTransaction';
import TransactionReq from './TransactionReq';

declare type Swap = {
  txId: string;
  completed: boolean;
  transactions: CompleteTransaction[];
};
export default Swap;
