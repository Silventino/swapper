declare type SimpleTransaction = {
  fee: number;
  flatFee: boolean;
  type: string;
  assetIndex?: number | null | undefined;
  from: string;
  to: string;
  amount: number;
  note?: Uint8Array;
  group?: Buffer;
  transaction?: string;
  signedBlob?: string;
};
export default SimpleTransaction;
