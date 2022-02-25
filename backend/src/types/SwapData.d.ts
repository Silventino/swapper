import Asset from "../db/entity/Asset";

type SwapData = {
  transactions: {
    type: string;
    assetIndex: number;
    from: string;
    to: string;
    amount: number;
  }[];
  donation?: {
    willDonate: boolean;
    asset: Asset;
    amount: number;
  }
  creatorAddress: string;
  rounds: number;
};

export default SwapData;
