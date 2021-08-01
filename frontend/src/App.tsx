import {
  Button,
  createStyles,
  Grid,
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
import CreateTransactionPage from "./components/CreateTransactionPage";
import GridCenter from "./components/generic/GridCenter";
import Header from "./components/Header";
import SwapTransaction from "./components/SwapTransaction";
import WalletContext, {
  SimpleTransaction,
} from "./components/WalletContextProvider";
import { HEADER_HEIGHT } from "./constants";

function App() {
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  const [transactions, setTransactions] = useState<SimpleTransaction[]>([
    { from: "", to: "", asset: null, amount: 0 },
    { from: "", to: "", asset: null, amount: 0 },
  ]);

  return (
    <div className="App">
      <Header />

      <div className={classes.appContent}>
        <CreateTransactionPage />
      </div>
    </div>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    appContent: {
      padding: 25,
      paddingTop: HEADER_HEIGHT + 25,
    },
    swapGrid: { marginTop: 10 },
  })
);

export default App;
