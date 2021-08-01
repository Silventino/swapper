import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import "reflect-metadata";
import "../App.css";

import GridCenter from "./generic/GridCenter";
import SwapTransaction from "./SwapTransaction";
import WalletContext, { SimpleTransaction } from "./WalletContextProvider";
import { HEADER_HEIGHT } from "../constants";

function CreateTransactionPage() {
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  const [transactions, setTransactions] = useState<SimpleTransaction[]>([
    { from: "", to: "", asset: null, amount: 0 },
    { from: "", to: "", asset: null, amount: 0 },
  ]);

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container spacing={4}>
      {transactions.map((item, index) => (
        <GridCenter item xs={12} md={6} className={classes.swapGrid}>
          <SwapTransaction
            index={index}
            transaction={transactions[index]}
            setTransaction={(t) => {
              transactions[index] = t;
              setTransactions([...transactions]);
            }}
            forceSenderLogged={index === 0}
            forceReceiverLogged={index !== 0}
          />
        </GridCenter>
      ))}
      <GridCenter item xs={12} style={{ marginTop: 20 }}>
        <Button
          variant={"contained"}
          onClick={() => walletContext.functions.createGroup(transactions)}
        >
          CREATE ATOMIC TRANSACTION
        </Button>
      </GridCenter>
    </Grid>
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

export default CreateTransactionPage;
