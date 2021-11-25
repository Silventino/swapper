import { AssetInfo } from './providers/WalletContextProvider';

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
  managerkey: '',
  reserveaddr: '',
  circulatingsupply: 10000000000,
  id: 0,
  verified: true,
  destroyed: false
};

export const YLDY_ASSET: AssetInfo = {
  assetname: "Yieldly",
  circulatingsupply: 10000000000000000,
  clawbackaddr: null,
  creator: "6SSWYFBRAGM5HMCANECPENBJWOV6UM3O54DYGRNK7GRCHU4QW2ZQJUPYNI",
  decimals: 6,
  defaultfrozen: false,
  destroyed: false,
  freezeaddr: null,
  id: 226701642,
  managerkey: "Q2JK6TIJB6XDU3X4TNVDWSW4M2RLKLU6O6EWNTHGYREMFIJGXYPHVURNMY",
  owner: null,
  reserveaddr: null,
  total: 10000000000000000,
  unitname: "YLDY",
  verified: true,
  url: ''
}

export const FINITE_ASSET: AssetInfo = {
  assetname: "DeFi-nite",
  circulatingsupply: 2000000000000000,
  creator: "XOGMYSO3KFWDLKIOP47GAIPNCR3EBNY3B3Q5DSJK3FWSSV6XKFNCNGD2TQ",
  decimals: 8,
  defaultfrozen: false,
  destroyed: false,
  id: 400593267,
  managerkey: "XOGMYSO3KFWDLKIOP47GAIPNCR3EBNY3B3Q5DSJK3FWSSV6XKFNCNGD2TQ",
  owner: null,
  reserveaddr: "XOGMYSO3KFWDLKIOP47GAIPNCR3EBNY3B3Q5DSJK3FWSSV6XKFNCNGD2TQ",
  total: 2100000000000000,
  unitname: "Finite",
  url: "https://gateway.pinata.cloud/ipfs/QmSu7qGvqEc8JSJ1VHtN8KaEWfeCr4ZFwPNd3XxMcyK6GQ",
  verified: false
}

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
