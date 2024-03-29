import BaseTransaction from './BaseTransaction';

declare type TransactionReq = BaseTransaction & {
  type: string;
  assetIndex?: number | null;
  from: string;
  to: string;
  amount: number;
  note?: string;
  group?: string;

  parentTxID?: string;
  blob?: string;
  txID?: string;
};
export default TransactionReq;
