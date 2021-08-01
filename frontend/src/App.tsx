import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
// import Login from "./components/Login";
// import SignIn from "./components/SignIn";
import algosdk from "algosdk";
import React, { useContext, useEffect, useState } from "react";
import "reflect-metadata";
import { waitForConfirmation } from "./algoHelper";
import "./App.css";
import Header from "./components/Header";
import SwapTransaction from "./components/SwapTransaction";
import WalletContext from "./components/WalletContextProvider";
import { HEADER_HEIGHT } from "./constants";

function App() {
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  // const group = async () => {
  //   try {
  //     let txn: any = await algodClient.getTransactionParams().do();

  //     const txn1 = {
  //       ...txn,
  //       fee: 1000,
  //       flatFee: true,
  //       type: "pay",
  //       from: "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU",
  //       to: "3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ",
  //       amount: 1000,
  //       note: new Uint8Array(Buffer.from("Hello World")),
  //     };

  //     const txn2 = {
  //       ...txn,
  //       fee: 1000,
  //       flatFee: true,
  //       type: "pay",
  //       from: "3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ",
  //       to: "DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU",
  //       amount: 1000,
  //       note: new Uint8Array(Buffer.from("Hello World")),
  //     };

  //     // Combine transactions
  //     let txns = [txn1, txn2];

  //     // // Group both transactions
  //     let txgroup = algosdk.assignGroupID(txns);
  //     console.log("txgroup", txgroup);

  //     txn1.group = txgroup[0].group;
  //     console.log("txn1", txn1);

  //     txn2.group = txgroup[0].group;
  //     console.log("txn2", txn2);

  //     let signedTxn1 = await myAlgoWallet.signTransaction(txn1);
  //     console.log("signedTxn1", signedTxn1);

  //     let signedTxn2 = await myAlgoWallet.signTransaction(txn2);
  //     console.log("signedTxn2", signedTxn2.txID);

  //     const signed: any = [signedTxn1.blob, signedTxn2.blob];
  //     const res = await algodClient.sendRawTransaction(signed).do();

  //     await waitForConfirmation(algodClient, res.txId, 4000);
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // };

  // useEffect(() => {
  //   console.log("wallet", walletContext.state);
  // }, [walletContext.state]);

  return (
    <div className="App">
      <Header />

      <div className={classes.appContent}>
        <SwapTransaction />
      </div>
      {/* <div>
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
      </div> */}

      {/* {login ? <Login /> : <SignIn />} */}
    </div>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    appContent: {
      padding: 25,
      paddingTop: HEADER_HEIGHT + 25,
    },
  })
);

export default App;
