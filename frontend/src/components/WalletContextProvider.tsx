import MyAlgoClient from '@randlabs/myalgo-connect';
import algosdk, { TransactionLike } from 'algosdk';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import transactionApi from 'src/api/transactionApi';
import { ALGO_ASSET } from 'src/constants';
import { waitForConfirmation } from 'src/helpers/algoHelper';
import BaseTransaction from 'src/types/BaseTransaction';
import CompleteTransaction from 'src/types/CompleteTransaction';
import PartialTransaction from 'src/types/PartialTransaction';

const TESTNET = false;

const token_testnet = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const server_testnet = 'http://127.0.0.1';
const port_testnet = 4001;

const token = { 'X-API-Key': 'aDo90XU8i07qRS8ze8KlFaqn7B2AkgFl6uJg04T2' };
const server = 'https://mainnet-algorand.api.purestake.io/ps2';
const port = 443;

//Tipando os dados que quero para usuário
export type AccountInfo = {
  name: string;
  address: string;
};

type AccountDetailedInfo = {
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
  }[];
  'created-apps': [];
  'created-assets': [];
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  round: number;
  status: string;
};

type TransactionInfo = {
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

export type AssetInfo = {
  creator: string;
  owner: null;
  total: number;
  decimals: number;
  defaultfrozen: boolean;
  unitname: string;
  assetname: string;
  url: string;
  managerkey: string;
  reserveaddr: string;
  circulatingsupply: number;
  id: number;
  verified: boolean;
  destroyed: boolean;
};

//Tipando as Props do contexto
type PropsWalletContext = {
  accounts: AccountInfo[];
  selectedAccount: AccountDetailedInfo | null;
  assets: AssetInfo[];
  myAlgoClient: MyAlgoClient;
  functions: {
    connectMyAlgo: () => Promise<void>;
    selectAccount: (addr: string) => Promise<void>;
    createAtomicTransaction: (t: PartialTransaction[]) => Promise<string>;
    signTransaction: (t: CompleteTransaction) => Promise<CompleteTransaction>;
    sendTransactions: (blobs: Uint8Array[]) => Promise<string>;
    getAssetInfo: (assetId: string | number) => Promise<AssetInfo>;
    optinAsset: (assetId: string | number) => Promise<void>;
    verifyGroup: (parentTx: string, transactions: CompleteTransaction[]) => Promise<boolean>;
  };
};

const DEFAULT_VALUE = {
  accounts: [],
  selectedAccount: null,
  assets: [],
  // setState: () => {}, //função de inicialização
  myAlgoClient: new MyAlgoClient(),
  functions: {
    connectMyAlgo: async () => {},
    selectAccount: async (addr: string) => {},
    createAtomicTransaction: async (t: PartialTransaction[]) => {
      return '';
    },
    signTransaction: async () => {
      return {} as any;
    },
    sendTransactions: async () => {
      return {} as any;
    },
    getAssetInfo: async () => {
      return {} as any;
    },
    optinAsset: async () => {
      return {} as any;
    },
    verifyGroup: async () => {
      return {} as any;
    }
  }
};

const WalletContext = createContext<PropsWalletContext>(DEFAULT_VALUE);

const WalletContextProvider: React.FC = ({ children }) => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountDetailedInfo | null>(null);

  const [myAlgoClient] = useState(new MyAlgoClient());
  const [algodClient] = useState(
    TESTNET
      ? new algosdk.Algodv2(token_testnet, server_testnet, port_testnet)
      : new algosdk.Algodv2(token, server, port)
  );

  const connectMyAlgo = async () => {
    try {
      // PRODUCTION ///////
      const res = await myAlgoClient.connect();

      // DEV /////////////
      // const res = [
      //   {
      //     address: '3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ',
      //     name: 'MyAlgoWallet'
      //   },
      //   {
      //     address: 'DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU',
      //     name: 'TipBot'
      //   }
      // ];
      //////////////////

      setAccounts(res);
      if (!selectedAccount && res.length) {
        selectAccount(res[0].address);
      }
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const selectAccount = async (address: string) => {
    try {
      const res = await axios.get<AccountDetailedInfo>(
        TESTNET
          ? `https://testnet.algoexplorerapi.io/v2/accounts/${address}`
          : `https://algoexplorerapi.io/v2/accounts/${address}`
      );
      setSelectedAccount(res.data);
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const getAssetInfo = async (assetId: string | number) => {
    try {
      const res = await axios.get<AssetInfo>(
        TESTNET
          ? `https://testnet.algoexplorerapi.io/v1/asset/${assetId}`
          : `https://algoexplorerapi.io/v1/asset/${assetId}`
      );
      return res.data;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const getAllAssetInfo = async () => {
    try {
      if (!selectedAccount) {
        return;
      }

      const newAssets: AssetInfo[] = [ALGO_ASSET];
      for (let i = 0; i < selectedAccount.assets.length; i++) {
        const item = selectedAccount.assets[i];
        const res = await getAssetInfo(item['asset-id']);
        if (res) {
          newAssets.push(res);
        }
      }

      setAssets(newAssets);
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const getBaseTransaction = async () => {
    let txn = (await algodClient.getTransactionParams().do()) as BaseTransaction;
    return txn;
  };

  const optinAsset = async (assetIndex: number | string) => {
    try {
      const baseTnx = await getBaseTransaction();

      const txn: CompleteTransaction = {
        ...baseTnx,
        fee: 1000,
        flatFee: true,
        type: 'axfer',
        assetIndex: parseInt(assetIndex as string),
        from: selectedAccount!.address,
        to: selectedAccount!.address,
        amount: 0
      };

      const signed = await signTransaction(txn);
      const txID = await sendTransactions([signed.blob!]);
      await waitForConfirmation(algodClient, txID, 10000);
      await selectAccount(selectedAccount!.address);
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const createAtomicTransaction = async (transactions: PartialTransaction[]) => {
    try {
      const baseTnx = await getBaseTransaction();

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
          // note: new Uint8Array(Buffer.from('Transaction made with the help of Atomic Ant'))
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

      const txID = await saveGroup(groupID, newTransactions);

      return txID;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const verifyGroup = async (parentTx: string, transactions: CompleteTransaction[]) => {
    let txgroup = algosdk.assignGroupID(transactions as TransactionLike[]);

    const groupID = txgroup[0].group;
    if (!groupID) {
      throw new Error('Error while verifying the group ID.');
    }

    const res = await axios.get<TransactionInfo>(
      TESTNET
        ? `https://testnet.algoexplorerapi.io/v1/transaction/${parentTx}`
        : `https://algoexplorerapi.io/v1/transaction/${parentTx}`
    );

    const note = atob(res.data.noteb64);
    const registeredGroupID = Buffer.from(JSON.parse(note).data);

    const verified = txgroup.every((item) => item.group?.compare(registeredGroupID) === 0);

    if (!verified) {
      throw new Error('Could not verify the swap. Please do not sign the transactions.');
    }

    return verified;
  };

  const saveGroup = async (groupID: Buffer, transactions: CompleteTransaction[]) => {
    if (!selectedAccount) {
      return '';
    }

    // const teste = transactions.map((item) => fromCompleteTransaction(item));

    const baseTnx = await getBaseTransaction();
    const txn: TransactionLike = {
      ...baseTnx,
      fee: 1000,
      flatFee: true,
      type: 'pay' as any,
      from: selectedAccount.address,
      to: 'VT7NZ62266IYHMEHWXLZXARZLA324BDTTKNJPYWXBNDO7TYMWJY27KC2XY',
      amount: 1,
      note: new Uint8Array(Buffer.from(JSON.stringify(groupID)))
    } as TransactionLike;

    let signedTxn = await myAlgoClient.signTransaction(txn as any);
    const txID = await sendTransactions([signedTxn.blob]);

    await transactionApi.insertAtomicTransaction(selectedAccount.address, transactions, txID);

    return txID;
  };

  const signTransaction = async (txn: CompleteTransaction) => {
    try {
      const signed = await myAlgoClient.signTransaction(txn as any);
      txn.blob = signed.blob;
      txn.txID = signed.txID;
      return txn;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const sendTransactions = async (transactions: Uint8Array[]) => {
    try {
      const res: { txId: string } = await algodClient.sendRawTransaction(transactions).do();

      if (!res.txId) {
        throw new Error('Transaction incompleted.');
      }
      await waitForConfirmation(algodClient, res.txId, 10000);
      // const res = await axios.post(
      //   "https://testnet.algoexplorerapi.io/v2/transactions",
      //   signed[0]
      // );
      return res.txId;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getAllAssetInfo();
  }, [selectedAccount]);

  return (
    <WalletContext.Provider
      value={{
        myAlgoClient,
        accounts,
        selectedAccount,
        assets,
        functions: {
          connectMyAlgo,
          selectAccount,
          createAtomicTransaction,
          signTransaction,
          sendTransactions,
          getAssetInfo,
          optinAsset,
          verifyGroup
        }
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
export { WalletContextProvider };
export default WalletContext;