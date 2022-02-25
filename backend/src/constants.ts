import Asset from "./db/entity/Asset";
import CompleteTransaction from "./types/CompleteTransaction";
import TransactionReq from "./types/TransactionReq";

export const STATUS_IN_PROGRESS = 0;
export const STATUS_COMPLETED = 1;
export const STATUS_DEAD = 2;


export const ALGO_ASSET: Asset = {
  creator: '',
  owner: '',
  total: 0,
  decimals: 6,
  defaultfrozen: false,
  unitname: 'ALGO',
  assetname: 'ALGO',
  url: 'https://icodrops.com/wp-content/uploads/2018/03/Algorand-logo.jpg',
  managerkey: '',
  reserveaddr: '',
  circulatingsupply: 10000000000,
  id: 0,
  verified: true,
  destroyed: false
};

export const DONATION_ADDRESS = 'VT7NZ62266IYHMEHWXLZXARZLA324BDTTKNJPYWXBNDO7TYMWJY27KC2XY';

export function treatTransaction(t: CompleteTransaction) {
  const newOne: TransactionReq = {
    ...t,
    note: t.note ? JSON.stringify(t.note) : undefined,
    group: t.group ? JSON.stringify(t.group) : undefined,
    blob: t.blob ? JSON.stringify(t.blob) : undefined
  };
  return newOne;
}
