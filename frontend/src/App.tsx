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
