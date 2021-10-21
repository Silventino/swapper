import { AssetInfo } from './components/WalletContextProvider';

export const HEADER_HEIGHT = 60;

export const ALGO_ASSET: AssetInfo = {
  creator: '',
  owner: null,
  total: 0,
  decimals: 6,
  defaultfrozen: false,
  unitname: 'ALGO',
  assetname: 'ALGO',
  url: 'https://pbs.twimg.com/profile_images/1377008414287654913/ShEGMZ0c_400x400.jpg',
  // url: '',
  managerkey: '',
  reserveaddr: '',
  circulatingsupply: 10000000000,
  id: 0,
  verified: true,
  destroyed: false
};

export const colors = {
  backgroundDark: '#151320',
  background: '#1f2229'
};

export const EMPTY_PARTIAL_TRANSACTION = {
  from: '',
  to: '',
  assetIndex: 0,
  amount: 0,
  type: ''
};

export const STATUS_IN_PROGRESS = 0;
export const STATUS_COMPLETED = 1;
export const STATUS_DEAD = 2;
