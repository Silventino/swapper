import BaseTransaction from './BaseTransaction';

declare type CompleteTransaction = BaseTransaction & {
  type: string;
  assetIndex?: number;
  from: string;
  to: string;
  amount: number;
  note?: Uint8Array;
  group?: Buffer;
  closeRemainderTo?: string;

  parentTxID?: string;
  id?: number;
  blob?: Uint8Array;
  txID?: string;
};
export default CompleteTransaction;
