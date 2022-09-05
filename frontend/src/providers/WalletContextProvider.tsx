import MyAlgoClient, { AlgorandTxn } from '@randlabs/myalgo-connect';
import algosdk, { TransactionLike } from 'algosdk';
import axios from 'axios';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import swapApi from 'src/api/swapApi';
import { ALGO_ASSET, DONATION_ADDRESS } from 'src/constants';
import { waitForConfirmation } from 'src/helpers/algoHelper';
import { sleep, useLocalStorage } from 'src/helpers/helper';
import BaseTransaction from 'src/types/BaseTransaction';
import CompleteTransaction from 'src/types/CompleteTransaction';
import PartialTransaction from 'src/types/PartialTransaction';
import { DonationInfo } from 'src/components/CheckboxDonation';
import assetApi from '../api/assetApi';

const token = { 'X-API-Key': 'aDo90XU8i07qRS8ze8KlFaqn7B2AkgFl6uJg04T2' };
const server = 'https://mainnet-algorand.api.purestake.io/ps2';
const port = 443;

export type AccountInfo = {
  name: string;
  address: string;
};

export type AccountDetailedInfo = {
  address: string;
  amount: number;
  'amount-without-pending-rewards': number;
  'apps-local-state': [];
  'apps-total-schema': { 'num-byte-slice': number; 'num-uint': number };
  assets: {
    amount: number;
    'asset-id': number;
    creator: string;
    'is-frozen': boolean;
    deleted: boolean;
    'opted-in-at-round': number;
    decimals: number;
    'unit-name': string;
    name: string;
    verification: {
      score: number;
      reputation: string;
      name: string;
      title: string;
      description: string;
      'unit-name': string;
      url: string;
    };
  }[];

  'created-apps': any[];
  'created-assets': any[];
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  round: number;
  status: string;
};

export type AccountDetailedInfoRes = {
  account: AccountDetailedInfo;
  'current-round': number;
};

export type TransactionInfo = {
  type: string;
  tx: string;
  from: string;
  fee: number;
  'first-round': number;
  'last-round': number;
  noteb64: string;
  round: number;
  fromrewards: number;
  genesisID: string;
  genesishashb64: string;
  fromindex: number;
  frombalance: number;
  accumulatedfromrewards: number;
  timestamp: number;
  index: number;
  payment: any;
};

export type TransactionInfoV2 = {
  'current-round': number;
  transaction: {
    'block-rewards-level': number;
    'close-rewards': number;
    'closing-amount': number;
    'confirmed-round': number;
    'decompiled-code': unknown;
    fee: number;
    'first-valid': number;
    id: string;
    index: number;
    'inner-tx-offset': number;
    'intra-round-offset': number;
    'last-valid': number;
    logs: unknown[];
    note: string;
    'payment-transaction': {
      amount: number;
      'close-acc-rewards': number;
      'close-amount': number;
      'close-balance': number;
      receiver: string;
      'receiver-acc-rewards': number;
      'receiver-balance': number;
      'receiver-tx-counter': number;
    };
    'receiver-rewards': number;
    'round-time': number;
    sender: string;
    'sender-acc-rewards': number;
    'sender-balance': number;
    'sender-rewards': number;
    'sender-tx-counter': number;
    signature: {
      sig: string;
    };
    'tx-type': string;
  };
};

export type AssetInfo = {
  id: number;
  creator: string;
  owner: null;
  total: number;
  decimals: number;
  defaultfrozen: boolean;
  unitname: string;
  assetname: string;
  url: string;
  managerkey: string;
  reserveaddr: string | null;
  clawbackaddr?: string | null;
  freezeaddr?: string | null;
  circulatingsupply: number;
  verified: boolean;
  destroyed: boolean;
};

//Tipando as Props do contexto
type PropsWalletContext = {
  accounts: AccountInfo[];
  selectedAccount: AccountDetailedInfo | null;
  assets: AssetInfo[];
  accountAssets: AssetInfo[];
  loadingAccount: boolean;
  myAlgoClient: MyAlgoClient;

  // functions
  connectMyAlgo: () => Promise<void>;
  selectAccount: (addr: string) => Promise<void>;
  createAtomicTransaction: (t: PartialTransaction[], d?: DonationInfo, r?: number) => Promise<string>;
  signTransaction: (t: CompleteTransaction) => Promise<CompleteTransaction>;
  signTransactions: (t: CompleteTransaction[]) => Promise<CompleteTransaction[]>;
  sendTransactions: (blobs: Uint8Array[]) => Promise<string>;
  // getAssetInfo: (assetId: string | number) => Promise<AssetInfo>;
  optinAssets: (assetIds: string[] | number[]) => Promise<void>;
  optoutAssets: (assetIds: AssetInfo[]) => Promise<void>;
  // verifyGroup: (parentTx: string, transactions: CompleteTransaction[]) => Promise<boolean>;
  loadAssetsFromAddress: (address: string) => Promise<void>;
  getAssetsFromAddress: (address: string, onlyHolding: boolean) => Promise<AssetInfo[]>;
  loadAsset: (assetId: string) => Promise<AssetInfo>;
  logout: () => void;
};

const DEFAULT_WALLET_CONTEXT_VALUE = {
  accounts: [],
  selectedAccount: null,
  assets: [],
  accountAssets: [],
  loadingAccount: false,
  myAlgoClient: new MyAlgoClient(),

  // functions
  connectMyAlgo: async () => {},
  selectAccount: async (addr: string) => {},
  createAtomicTransaction: async (t: PartialTransaction[]) => {
    return '';
  },
  signTransaction: async () => {
    return {} as any;
  },
  signTransactions: async () => {
    return {} as any;
  },
  sendTransactions: async () => {
    return {} as any;
  },
  optinAssets: async () => {
    return {} as any;
  },
  optoutAssets: async () => {
    return {} as any;
  },
  logout: async () => {
    return {} as any;
  },
  loadAssetsFromAddress: async () => {
    return {} as any;
  },
  getAssetsFromAddress: async () => {
    return [];
  },
  loadAsset: async () => {
    return {} as any;
  }
};

const WalletContext = createContext<PropsWalletContext>(DEFAULT_WALLET_CONTEXT_VALUE);

const WalletContextProvider: React.FC = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useLocalStorage<AccountDetailedInfo | null>('selectedAccount', null);
  const [accounts, setAccounts] = useLocalStorage<AccountInfo[]>('accounts', []);
  const [assetDict, setAssetDict] = useLocalStorage<AssetInfo[]>('assets', []);

  const [accountAssets, setAccountAssets] = useState<AssetInfo[]>([]);
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [loadingAccount, setLoadingAccount] = useState(false);

  const [myAlgoClient] = useState(new MyAlgoClient());
  const [algodClient] = useState(new algosdk.Algodv2(token, server, port));

  const getInfoFromAddress = useCallback(
    async (address: string, onlyHolding: boolean = false): Promise<[x: AccountDetailedInfo, y: AssetInfo[]]> => {
      const res = await axios.get<AccountDetailedInfoRes>(`https://indexer.algoexplorerapi.io/v2/accounts/${address}`);
      const newSelectedAccount = res?.data?.account;

      const assetsNotFound = [];
      let newAssets: AssetInfo[] = [];
      for (let i = 0; i < newSelectedAccount.assets?.length ?? 0; i++) {
        const asset = newSelectedAccount.assets[i];
        if (onlyHolding && asset.amount === 0) {
          continue;
        }

        const knownAsset = assetDict[asset['asset-id']];
        if (knownAsset) {
          newAssets.push(knownAsset);
        } else {
          assetsNotFound.push(asset['asset-id']);
        }
      }

      // LOADING ASSETS IN MULTIPLE REQUESTS //////////////////////////////////////////////
      let i = 0;
      while (i < assetsNotFound.length) {
        const partialNotFound = assetsNotFound.slice(i, i + 10);
        const otherAssets = await assetApi.getManyAssetInfo(partialNotFound);
        for (let j = 0; j < otherAssets.length; j++) {
          const asset = otherAssets[j];
          assetDict[asset.id] = asset;
        }
        newAssets = newAssets.concat(otherAssets);

        i = i + 10;
      }

      const partialNotFound = assetsNotFound.slice(i, i + 10);
      if (partialNotFound.length) {
        const otherAssets = await assetApi.getManyAssetInfo(partialNotFound);
        for (let j = 0; j < otherAssets.length; j++) {
          const asset = otherAssets[j];
          assetDict[asset.id] = asset;
        }
        newAssets = newAssets.concat(otherAssets);
      }
      ///////////////////////////////////////////////////////////////////////////////////////

      newAssets.push(ALGO_ASSET);
      setAssetDict({ ...assetDict });

      return [newSelectedAccount, newAssets];
    },
    [assetDict, setAssetDict]
  );

  const selectAccount = useCallback(
    async (address: string) => {
      setLoadingAccount(true);
      try {
        const [newSelectedAccount, newAssets] = await getInfoFromAddress(address);

        setAssets([...newAssets]);
        setAccountAssets([...newAssets]);
        setSelectedAccount(newSelectedAccount);
      } catch (err) {
        console.log('err', err);
        throw err;
      }
      setLoadingAccount(false);
    },
    [getInfoFromAddress, setSelectedAccount]
  );

  const connectMyAlgo = useCallback(async () => {
    try {
      const res = await myAlgoClient.connect();
      setAccounts(res);
      if (!res?.length) {
        throw new Error('Failed to connect wallet.');
      }
      selectAccount(res[0].address);
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }, [myAlgoClient, setAccounts, selectAccount]);

  const getBaseTransaction = useCallback(async () => {
    let txn = (await algodClient.getTransactionParams().do()) as BaseTransaction;
    return txn;
  }, [algodClient]);

  const sendTransactions = useCallback(
    async (transactions: Uint8Array[]) => {
      try {
        const res: { txId: string } = await algodClient.sendRawTransaction(transactions).do();

        if (!res.txId) {
          throw new Error('Transaction incomplete.');
        }
        await waitForConfirmation(algodClient, res.txId, 10000);
        return res.txId;
      } catch (err) {
        throw err;
      }
    },
    [algodClient]
  );

  const signTransactions = useCallback(
    async (txns: CompleteTransaction[]) => {
      try {
        const signeds = await myAlgoClient.signTransaction(txns as AlgorandTxn[]);
        for (let i = 0; i < signeds.length; i++) {
          const signed = signeds[i];
          txns[i].blob = signed.blob;
          txns[i].txID = signed.txID;
        }
        return txns;
      } catch (err) {
        console.log('err', err);
        throw err;
      }
    },
    [myAlgoClient]
  );

  const optinAssets = useCallback(
    async (assetIds: number[] | string[]) => {
      try {
        const baseTnx = await getBaseTransaction();
        const transactions = [];

        for (let i = 0; i < assetIds.length; i++) {
          const assetId = assetIds[i];
          const txn: CompleteTransaction = {
            ...baseTnx,
            fee: 1000,
            flatFee: true,
            type: 'axfer',
            assetIndex: parseInt(assetId as string),
            from: selectedAccount!.address,
            to: selectedAccount!.address,
            amount: 0
          };
          transactions.push(txn);
        }

        let txgroup = algosdk.assignGroupID(transactions as TransactionLike[]);
        const groupID = txgroup[0].group;
        if (!groupID) {
          throw new Error('Error while creating the group ID.');
        }

        for (let i = 0; i < transactions.length; i++) {
          transactions[i].group = groupID;
        }
        const signed = await signTransactions(transactions);
        const blobs = signed.map((item) => item.blob!);

        const txID = await sendTransactions(blobs);
        await waitForConfirmation(algodClient, txID, 10000);
        await sleep(4000);
        await selectAccount(selectedAccount!.address);
      } catch (err) {
        console.log('err', err);
        throw err;
      }
    },
    [algodClient, getBaseTransaction, selectAccount, selectedAccount, sendTransactions, signTransactions]
  );

  const optoutAssets = useCallback(
    async (assets: AssetInfo[]) => {
      try {
        const baseTnx = await getBaseTransaction();

        const txns = [];

        for (let i = 0; i < assets.length; i++) {
          const asset = assets[i];
          const txn: CompleteTransaction = {
            ...baseTnx,
            fee: 1000,
            flatFee: true,
            type: 'axfer',
            assetIndex: asset.id,
            from: selectedAccount!.address,
            to: selectedAccount!.address,
            closeRemainderTo: asset.creator,
            amount: 0
          };
          txns.push(txn);
        }

        let txgroup = algosdk.assignGroupID(txns as TransactionLike[]);

        const groupID = txgroup[0].group;
        if (!groupID) {
          throw new Error('Error while creating the group ID.');
        }

        for (let i = 0; i < txns.length; i++) {
          txns[i].group = groupID;
        }

        const signed = await signTransactions(txns);
        const blobs = signed.map((item) => item.blob!);
        const txID = await sendTransactions(blobs);
        await waitForConfirmation(algodClient, txID, 10000);
        await sleep(4000);
        await selectAccount(selectedAccount!.address);
      } catch (err) {
        console.log('err', err);
        throw err;
      }
    },
    [algodClient, getBaseTransaction, selectAccount, selectedAccount, sendTransactions, signTransactions]
  );

  const saveGroup = useCallback(
    async (groupID: Buffer, transactions: CompleteTransaction[], donation?: DonationInfo) => {
      if (!selectedAccount) {
        return '';
      }

      const baseTnx = await getBaseTransaction();
      let txn;

      if (donation && donation.willDonate) {
        txn = {
          ...baseTnx,
          fee: 1000,
          flatFee: true,
          type: donation.asset.id === ALGO_ASSET.id ? 'pay' : 'axfer',
          assetIndex: donation.asset.id === ALGO_ASSET.id ? undefined : donation.asset.id,
          from: selectedAccount.address,
          to: DONATION_ADDRESS,
          amount: donation.amount * Math.pow(10, donation.asset.decimals),
          note: new Uint8Array(Buffer.from(JSON.stringify(groupID)))
        } as TransactionLike;
      } else {
        txn = {
          ...baseTnx,
          fee: 1000,
          flatFee: true,
          type: 'pay' as any,
          from: selectedAccount.address,
          to: DONATION_ADDRESS,
          amount: 1,
          note: new Uint8Array(Buffer.from(JSON.stringify(groupID)))
        } as TransactionLike;
      }

      let signedTxn = await myAlgoClient.signTransaction(txn as any);
      const txID = await sendTransactions([signedTxn.blob]);

      await swapApi.insertSwap(transactions, txID);

      return txID;
    },
    [myAlgoClient, getBaseTransaction, selectedAccount, sendTransactions]
  );

  const createAtomicTransaction = useCallback(
    async (transactions: PartialTransaction[], donation?: DonationInfo, minutes: number = 30) => {
      try {
        const baseTnx = await getBaseTransaction();
        baseTnx.lastRound = baseTnx.firstRound + minutes * 15;

        const newTransactions: CompleteTransaction[] = [];
        for (let i = 0; i < transactions.length; i++) {
          const transaction = transactions[i];

          let assetInfo;
          if (!transaction.assetIndex) {
            assetInfo = ALGO_ASSET;
          } else {
            assetInfo = assets.find((item) => item.id === transaction.assetIndex);
          }

          if (!assetInfo) {
            throw new Error('Asset not found.');
          }

          const txn: CompleteTransaction = {
            ...baseTnx,
            fee: 1000,
            flatFee: true,
            type: transaction.assetIndex === ALGO_ASSET.id ? 'pay' : 'axfer',
            assetIndex: transaction.assetIndex === ALGO_ASSET.id ? undefined : transaction.assetIndex,
            from: transaction.from,
            to: transaction.to,
            amount: transaction.amount * Math.pow(10, assetInfo.decimals)
          };
          newTransactions.push(txn);
        }

        // Group transactions
        let txgroup = algosdk.assignGroupID(newTransactions as TransactionLike[]);

        const groupID = txgroup[0].group;
        if (!groupID) {
          throw new Error('Error while creating the group ID.');
        }

        for (let i = 0; i < newTransactions.length; i++) {
          newTransactions[i].group = groupID;
        }

        const txID = await saveGroup(groupID, newTransactions, donation);

        return txID;
      } catch (err) {
        console.log('err', err);
        throw err;
      }
    },
    [assets, getBaseTransaction, saveGroup]
  );

  const signTransaction = useCallback(
    async (txn: CompleteTransaction) => {
      try {
        const signed = await myAlgoClient.signTransaction(txn as AlgorandTxn);
        txn.blob = signed.blob;
        txn.txID = signed.txID;
        return txn;
      } catch (err) {
        throw err;
      }
    },
    [myAlgoClient]
  );

  const getAssetsFromAddress = useCallback(
    async (address: string, onlyHolding: boolean = false) => {
      try {
        const info = await getInfoFromAddress(address, onlyHolding);
        const newAssets = info[1];
        return newAssets;
      } catch (err) {
        throw err;
      }
    },
    [getInfoFromAddress]
  );

  const loadAssetsFromAddress = useCallback(
    async (address: string) => {
      setLoadingAccount(true);
      try {
        const info = await getInfoFromAddress(address);
        const newAssets = info[1];
        const newSet = new Set(assets.concat(newAssets));
        setAssets(Array.from(newSet.values()));
      } catch (err) {
        setLoadingAccount(false);
        throw err;
      }
      setLoadingAccount(false);
    },
    [assets, getInfoFromAddress]
  );

  const loadAsset = useCallback(
    async (assetIdStr: string) => {
      setLoadingAccount(true);
      try {
        const assetId = parseInt(assetIdStr);
        const alreadyLoaded = assets.find((item) => item.id === assetId);
        if (alreadyLoaded) {
          setLoadingAccount(false);
          return alreadyLoaded;
        }
        const newAsset = await assetApi.getAssetInfo(assetId);
        assets.push(newAsset);
        setAssets(assets);
        setLoadingAccount(false);
        return newAsset;
      } catch (err) {
        setLoadingAccount(false);
        throw err;
      }
    },
    [assets]
  );

  const logout = () => {
    setAccounts([]);
    setSelectedAccount(null);
  };

  useEffect(() => {
    if (!selectedAccount && accounts?.length) {
      selectAccount(accounts[0].address);
    }
  }, [selectedAccount, accounts, selectAccount]);

  useEffect(() => {
    if (!assets?.length && selectedAccount) {
      selectAccount(selectedAccount.address);
    }
  }, [assets, selectedAccount, selectAccount]);

  return (
    <WalletContext.Provider
      value={{
        myAlgoClient,
        accounts,
        selectedAccount,
        assets,
        accountAssets,
        loadingAccount,

        // functions
        connectMyAlgo,
        selectAccount,
        createAtomicTransaction,
        signTransaction,
        signTransactions,
        sendTransactions,
        optinAssets,
        optoutAssets,
        loadAssetsFromAddress,
        getAssetsFromAddress,
        loadAsset,
        logout
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContextProvider };

export default WalletContext;
