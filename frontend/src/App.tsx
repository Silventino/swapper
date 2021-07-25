import "reflect-metadata";

import React, { useEffect, useState } from "react";
import "./App.css";
// import Login from "./components/Login";
// import SignIn from "./components/SignIn";

import MyAlgoWallet from "@randlabs/myalgo-connect";
import algosdk from "algosdk";
import { Button } from "@material-ui/core";
import { waitForConfirmation } from "./algoHelper";

const token =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
// "7f50af367cd44edf246d860db4eb5f65b9fcfe1171f2c16d105999c35f5e2f50";
const server = "http://127.0.0.1";
const port = 4001;

const algodClient = new algosdk.Algodv2(token, server, port);

function App() {
  const [myAlgoWallet, setMyAlgoWallet] = useState(new MyAlgoWallet());

  const connectMyAlgo = () => {
    myAlgoWallet
      .connect()
      .then((accounts: any) => {
        // Accounts is an array that has all public addresses shared by the user
        console.log("accounts", accounts);
      })
      .catch((err: any) => {
        // Error
        console.log("err", err);
      });
  };

  const teste = async () => {
    try {
      let txn: any = await algodClient.getTransactionParams().do();

      txn = {
        ...txn,
        fee: 1000,
        flatFee: true,
        type: "pay",
        from: "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU",
        to: "3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ",
        amount: 1,
        note: new Uint8Array(Buffer.from("Hello World")),
      };

      console.log("txn", txn);

      let signedTxn = await myAlgoWallet.signTransaction(txn);
      console.log("signedTxn", signedTxn.txID);

      await algodClient.sendRawTransaction(signedTxn.blob).do();
    } catch (err) {
      console.log("err", err);
    }
  };

  const balance = async () => {
    try {
      let accountInfo = await algodClient
        .accountInformation(
          "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU"
        )
        .do();
      console.log("Account balance: %d microAlgos", accountInfo.amount);
      console.log("Account", accountInfo);
    } catch (err) {
      console.log("err", err);
    }
  };

  // const createAsset = async () => {
  //   try {
  //     const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
  //       "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU",
  //       undefined,
  //       100000,
  //       4,
  //       false,
  //       undefined,
  //       undefined,
  //       undefined,
  //       undefined,
  //       "SILT",
  //       "SILT",
  //       "",
  //       "",
  //       {
  //         fee: 1,
  //         firstRound: 1,
  //         lastRound: 1000000,
  //         genesisID: "",
  //         genesisHash: "",
  //       },
  //       undefined
  //     );

  //     console.log(txn);

  //     let signedTxn = await myAlgoWallet.signTransaction(txn as any);
  //     const res = await algodClient.sendRawTransaction(signedTxn.blob).do();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const group = async () => {
    try {
      let txn: any = await algodClient.getTransactionParams().do();

      const txn1 = {
        ...txn,
        fee: 1000,
        flatFee: true,
        type: "pay",
        from: "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU",
        to: "3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ",
        amount: 1000,
        note: new Uint8Array(Buffer.from("Hello World")),
      };

      const txn2 = {
        ...txn,
        fee: 1000,
        flatFee: true,
        type: "pay",
        from: "3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ",
        to: "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU",
        amount: 1000,
        note: new Uint8Array(Buffer.from("Hello World")),
      };

      // Combine transactions
      let txns = [txn1, txn2];

      // // Group both transactions
      let txgroup = algosdk.assignGroupID(txns);
      console.log("txgroup", txgroup);

      txn1.group = txgroup[0].group;
      console.log("txn1", txn1);

      txn2.group = txgroup[0].group;
      console.log("txn2", txn2);

      let signedTxn1 = await myAlgoWallet.signTransaction(txn1);
      console.log("signedTxn1", signedTxn1);

      let signedTxn2 = await myAlgoWallet.signTransaction(txn2);
      console.log("signedTxn2", signedTxn2.txID);

      const signed: any = [signedTxn1.blob, signedTxn2.blob];
      const res = await algodClient.sendRawTransaction(signed).do();

      await waitForConfirmation(algodClient, res.txId, 4000);
    } catch (err) {
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   // teste();
  // }, []);

  const [login, setLogin] = useState(true);
  return (
    <div className="App">
      <Button
        variant="contained"
        color="primary"
        onClick={() => connectMyAlgo()}
      >
        Connect
      </Button>
      <Button variant="contained" color="primary" onClick={() => balance()}>
        BALANCE
      </Button>
      <Button variant="contained" color="primary" onClick={() => group()}>
        SEND
      </Button>
      <Button variant="contained" color="primary" onClick={() => createAsset()}>
        CREATE
      </Button>
      {/* {login ? <Login /> : <SignIn />} */}
    </div>
  );
}

export default App;
