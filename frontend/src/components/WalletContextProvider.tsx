import React, { createContext, useEffect, useState } from "react";
import MyAlgoClient from "@randlabs/myalgo-connect";
import algosdk, { Algodv2 } from "algosdk";

const token =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
// "7f50af367cd44edf246d860db4eb5f65b9fcfe1171f2c16d105999c35f5e2f50";
const server = "http://127.0.0.1";
const port = 4001;

//Tipando os dados que quero para usuário
type AccountInfo = {
  name: string;
  address: string;
};

type AccountDetailedInfo = {
  address: string;
  amount: number;
  "amount-without-pending-rewards": number;
  "apps-local-state": [];
  "apps-total-schema": { "num-byte-slice": number; "num-uint": number };
  assets: {
    amount: number;
    "asset-id": number;
    creator: string;
    "is-frozen": boolean;
  }[];
  "created-apps": [];
  "created-assets": [];
  "pending-rewards": number;
  "reward-base": number;
  rewards: number;
  round: number;
  status: string;
};

// type AccountDetailedInfo = {
//   address: "3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ"
//   amount: 9994000,
//   "amount-without-pending-rewards": 9994000,
//   "apps-local-state": Array [],
//   "apps-total-schema": Object { "num-byte-slice": 0, "num-uint": 0 },
//   assets: Array [ {…} ],
//   "created-apps": Array [],
//   "created-assets": Array [],
//   "pending-rewards": 0,
//   "reward-base": 27521,
//   rewards: 0,
//   round: 15742709,
//   status: "Offline",
// };

//Tipando as Props do contexto
type PropsWalletContext = {
  accounts: AccountInfo[];
  selectedAccount: AccountDetailedInfo | null;
  myAlgoClient: MyAlgoClient;
  algodClient: Algodv2;
  functions: {
    connectMyAlgo: () => void;
    selectAccount: (addr: string) => void;
  };
};

//Valor default do contexto
const DEFAULT_VALUE = {
  accounts: [],
  selectedAccount: null,
  // setState: () => {}, //função de inicialização
  myAlgoClient: new MyAlgoClient(),
  algodClient: new algosdk.Algodv2(token, server, port),
  functions: { connectMyAlgo: () => {}, selectAccount: (addr: string) => {} },
};

//criando nosso contexto WalletContext
const WalletContext = createContext<PropsWalletContext>(DEFAULT_VALUE);

/**
 * Função que irá conter o estado e função que irá alterar o estado 'setState'
 * quer irá prover o contexto para os componentes filhos da árvore
 */
const WalletContextProvider: React.FC = ({ children }) => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState<AccountDetailedInfo | null>(null);

  const [myAlgoClient] = useState(new MyAlgoClient());
  const [algodClient] = useState(new algosdk.Algodv2(token, server, port));

  const connectMyAlgo = async () => {
    try {
      const res = await myAlgoClient.connect();
      // Accounts is an array that has all public account shared by the user
      setAccounts(res);
      if (!selectedAccount && res.length) {
        selectAccount(res[0].address);
      }
      console.log("res", res);
    } catch (err) {
      console.log("err", err);
    }
  };

  const selectAccount = async (address: string) => {
    try {
      let accountInfo = (await algodClient
        .accountInformation(address)
        .do()) as AccountDetailedInfo;
      setSelectedAccount(accountInfo);
      // console.log("Account balance: %d microAlgos", accountInfo.amount);
      // console.log("Account", accountInfo);
    } catch (err) {
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   connectMyAlgo();
  // }, []);

  return (
    <WalletContext.Provider
      value={{
        myAlgoClient,
        algodClient,
        accounts,
        selectedAccount,
        functions: { connectMyAlgo, selectAccount },
        // setState,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
export { WalletContextProvider };
export default WalletContext;
