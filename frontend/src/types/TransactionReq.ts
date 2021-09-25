import BaseTransaction from './BaseTransaction';

declare type TransactionReq = BaseTransaction & {
  type: string;
  assetIndex?: number;
  from: string;
  to: string;
  amount: number;
  note?: string;
  group?: string;

  parentTxID?: string;
  id?: number;
  blob?: string;
  txID?: string;
};
export default TransactionReq;
