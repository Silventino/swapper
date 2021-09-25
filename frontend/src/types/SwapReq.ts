import TransactionReq from './TransactionReq';

declare type SwapReq = {
  txId: string;
  completed: boolean;
  transactions: TransactionReq[];
};
export default SwapReq;
