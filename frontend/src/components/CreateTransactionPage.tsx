import { Button, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import 'reflect-metadata';
import '../App.css';

import GridCenter from './generic/GridCenter';
import SwapTransaction from './SwapTransaction';
import WalletContext, { SimpleTransaction } from './WalletContextProvider';
import { HEADER_HEIGHT } from '../constants';
import { mostrarErro } from 'src/helpers/helper';

function CreateTransactionPage() {
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  const [transactions, setTransactions] = useState<SimpleTransaction[]>([
    {
      from: '',
      to: '',
      assetIndex: null,
      amount: 0,
      fee: 1000,
      flatFee: true,
      type: ''
    },
    {
      from: '',
      to: '',
      assetIndex: null,
      amount: 0,
      fee: 1000,
      flatFee: true,
      type: ''
    }
  ]);

  const createAtomicTransaction = async () => {
    try {
      walletContext.functions.createGroup(transactions);
    } catch (err) {
      mostrarErro(err);
    }
  };

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container spacing={4} className={classes.container}>
      {transactions.map((item, index) => (
        <GridCenter item xs={12} md={6} className={classes.swapGrid}>
          <SwapTransaction
            index={index}
            transaction={transactions[index]}
            setTransaction={(t) => {
              transactions[index] = t;
              setTransactions([...transactions]);
            }}
          />
        </GridCenter>
      ))}
      <GridCenter item xs={12} style={{ marginTop: 20 }}>
        <Button variant={'contained'} onClick={() => createAtomicTransaction()}>
          CREATE ATOMIC TRANSACTION
        </Button>
      </GridCenter>
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      maxWidth: 1000
    },
    swapGrid: { marginTop: 10 }
  })
);

export default CreateTransactionPage;
