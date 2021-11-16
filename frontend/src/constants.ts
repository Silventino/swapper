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
  url: 'https://icodrops.com/wp-content/uploads/2018/03/Algorand-logo.jpg',
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
  amount: 1,
  type: ''
};

export const STATUS_IN_PROGRESS = 0;
export const STATUS_COMPLETED = 1;
export const STATUS_DEAD = 2;
