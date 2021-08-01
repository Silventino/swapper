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
import GridCenter from "./components/generic/GridCenter";
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
        <Grid container spacing={4}>
          <GridCenter item xs={12} md={6} style={{ marginTop: 10 }}>
            <SwapTransaction index={0} />
          </GridCenter>
          <GridCenter item xs={12} md={6} style={{ marginTop: 10 }}>
            <SwapTransaction index={1} />
          </GridCenter>
          <GridCenter item xs={12} style={{ marginTop: 20 }}>
            <Button variant={"contained"}>CREATE ATOMIC TRANSACTION</Button>
          </GridCenter>
        </Grid>
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
  })
);

export default App;
