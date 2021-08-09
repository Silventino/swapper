import React, { createContext, useEffect, useState } from 'react';
import MyAlgoClient, { SignedTx } from '@randlabs/myalgo-connect';
import algosdk, { Algodv2, TransactionLike } from 'algosdk';
import axios from 'axios';
import { ALGO_ASSET } from 'src/constants';
import { waitForConfirmation } from 'src/helpers/algoHelper';
import transactionApi from 'src/api/transactionApi';
import { makeTestID } from 'src/helpers/helper';
import BaseTransaction from 'src/types/BaseTransaction';
import PartialTransaction from 'src/types/PartialTransaction';
import CompleteTransaction from 'src/types/CompleteTransaction';

const token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
// "7f50af367cd44edf246d860db4eb5f65b9fcfe1171f2c16d105999c35f5e2f50";
const server = 'http://127.0.0.1';
const port = 4001;

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
    createGroup: (t: PartialTransaction[]) => Promise<any>;
  };
};

//Valor default do contexto
const DEFAULT_VALUE = {
  accounts: [],
  selectedAccount: null,
  assets: [],
  // setState: () => {}, //função de inicialização
  myAlgoClient: new MyAlgoClient(),
  functions: {
    connectMyAlgo: async () => {},
    selectAccount: async (addr: string) => {},
    createGroup: async (t: PartialTransaction[]) => {}
  }
};

//criando nosso contexto WalletContext
const WalletContext = createContext<PropsWalletContext>(DEFAULT_VALUE);

/**
 * Função que irá conter o estado e função que irá alterar o estado 'setState'
 * quer irá prover o contexto para os componentes filhos da árvore
 */
const WalletContextProvider: React.FC = ({ children }) => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountDetailedInfo | null>(null);

  const [myAlgoClient] = useState(new MyAlgoClient());
  const [algodClient] = useState(new algosdk.Algodv2(token, server, port));

  const connectMyAlgo = async () => {
    try {
      // const res = await myAlgoClient.connect();

      const res = [
        {
          address: '3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ',
          name: 'MyAlgoWallet'
        },
        {
          address: 'DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU',
          name: 'TipBot'
        }
      ];
      setAccounts(res);
      if (!selectedAccount && res.length) {
        selectAccount(res[0].address);
      }
      console.log('res', res);
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const selectAccount = async (address: string) => {
    try {
      const res = await axios.get<AccountDetailedInfo>(`https://testnet.algoexplorerapi.io/v2/accounts/${address}`);
      setSelectedAccount(res.data);
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const getAssetInfo = async (assetId: string | number) => {
    try {
      const res = await axios.get<AssetInfo>(`https://testnet.algoexplorerapi.io/v1/asset/${assetId}`);
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
    // const res = await axios.get<TransactionDefaultParams>(
    //   "https://testnet.algoexplorerapi.io/v2/transactions/params"
    // );
    // return res.data;
    let txn = (await algodClient.getTransactionParams().do()) as BaseTransaction;
    return txn;
  };

  const createGroup = async (transactions: PartialTransaction[]) => {
    try {
      const baseTnx = await getBaseTransaction();

      const newTransactions: CompleteTransaction[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        if (!transaction.assetIndex) {
          throw new Error('Please, select a asset to transfer.');
        }

        const txn: CompleteTransaction = {
          ...baseTnx,
          fee: 1000,
          flatFee: true,
          type: transaction.assetIndex === ALGO_ASSET.id ? ('pay' as any) : ('axfer' as any),
          assetIndex: transaction.assetIndex === ALGO_ASSET.id ? undefined : (transaction.assetIndex as any),
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount,
          note: new Uint8Array(Buffer.from('Transaction made with the help of Atomic Ant'))
        };
        newTransactions.push(txn);
      }

      // Group both transactions
      let txgroup = algosdk.assignGroupID(newTransactions as TransactionLike[]);
      console.log('txgroup', txgroup);

      const groupID = txgroup[0].group;
      if (!groupID) {
        throw new Error('Error while creating the group ID.');
      }

      for (let i = 0; i < newTransactions.length; i++) {
        newTransactions[i].group = groupID;
      }

      await saveGroup(groupID, newTransactions);

      return { groupID, trasactions: newTransactions };
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  const saveGroup = async (groupID: Buffer, transactions: CompleteTransaction[]) => {
    if (!selectedAccount) {
      return;
    }

    // PRODUCTION ///////////
    const baseTnx = await getBaseTransaction();
    const txn: TransactionLike = {
      ...baseTnx,
      fee: 1000,
      flatFee: true,
      type: 'pay' as any,
      from: selectedAccount.address,
      to: 'DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU',
      amount: 1,
      note: new Uint8Array(groupID)
    } as TransactionLike;
    let signedTxn = await myAlgoClient.signTransaction(txn as any);

    // TEST
    // console.log('signedTxn.blob 1.', signedTxn.blob);
    // signedTxn.blob = new Uint8Array(Object.values(JSON.parse(JSON.stringify(signedTxn.blob))) as any);
    // console.log('signedTxn.blob 2', signedTxn.blob);

    const txID = await sendTransactions([signedTxn.blob]);

    if (!txID) {
      throw new Error('Transaction incompleted.');
    }
    waitForConfirmation(algodClient, txID, 10000);
    //////////////////////////

    // DEV //////////////////
    // const txID = makeTestID(20);
    /////////////////////////

    await transactionApi.insertAtomicTransaction(transactions, txID);
  };

  const sendTransactions = async (transactions: Uint8Array[]) => {
    try {
      const res: { txId: string } = await algodClient.sendRawTransaction(transactions).do();
      // const res = await axios.post(
      //   "https://testnet.algoexplorerapi.io/v2/transactions",
      //   signed[0]
      // );
      return res.txId;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  };

  //     console.log("signedTxn1", signedTxn1);
  //     let signedTxn2 = await myAlgoClient.signTransaction(txn2);
  //     console.log("signedTxn2", signedTxn2.txID);
  //     const signed: any = [signedTxn1.blob, signedTxn2.blob];
  // const res = await algodClient.sendRawTransaction(signed).do();
  // await waitForConfirmation(algodClient, res.txId, 4000);

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
        functions: { connectMyAlgo, selectAccount, createGroup }
        // setState,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
export { WalletContextProvider };
export default WalletContext;
