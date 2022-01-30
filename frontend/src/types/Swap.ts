import CompleteTransaction from './CompleteTransaction';

declare type Swap = {
  txId: string;
  status: number;
  transactions: CompleteTransaction[];
};
export default Swap;
