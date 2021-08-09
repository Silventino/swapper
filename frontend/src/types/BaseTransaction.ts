declare type BaseTransaction = {
  firstRound: number;
  genesisHash: string;
  genesisID: string;
  lastRound: number;
  fee: number;
  flatFee: boolean;
};
export default BaseTransaction;
