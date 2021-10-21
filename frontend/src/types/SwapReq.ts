import TransactionReq from './TransactionReq';

declare type SwapReq = {
  txId: string;
  status: number;
  transactions: TransactionReq[];
};
export default SwapReq;
