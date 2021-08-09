declare type PartialTransaction = {
  type: string;
  assetIndex?: number | null | undefined;
  from: string;
  to: string;
  amount: number;
};
export default PartialTransaction;
