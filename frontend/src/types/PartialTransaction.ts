declare type PartialTransaction = {
  type: string;
  assetIndex: number;
  from: string;
  to: string;
  amount: number;
};
export default PartialTransaction;
