import { Button, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext, useState } from 'react';
import 'reflect-metadata';
import '../App.css';

import GridCenter from '../components/generic/GridCenter';
import TransactionForm from '../components/TransactionForm';
import WalletContext from '../providers/WalletContextProvider';
import { HEADER_HEIGHT } from '../constants';
import { showError } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';

function CreateTransactionPage() {
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  // DEV //////////////
  // const [transactions, setTransactions] = useState<PartialTransaction[]>([
  //   {
  //     amount: 1,
  //     assetIndex: 21889879,
  //     from: '3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ',
  //     to: 'DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU',
  //     type: ''
  //   },
  //   {
  //     amount: 10,
  //     assetIndex: 21033643,
  //     from: 'DHMWJUWE5RSLI6Y7PU53UUT3VMN5U7NWP7DH2XLGYO3FRYJIUJUXBAXGLU',
  //     to: '3ITIMVIPABPBKFT5K36NV2XYZU3YNNACSXLNGVBJ4SJVILZNVRWX2HESWQ',
  //     type: ''
  //   }
  // ]);
  /////////////////////

  // PRODUCTION /////////
  const [transactions, setTransactions] = useState<PartialTransaction[]>([
    {
      from: '',
      to: '',
      assetIndex: 0,
      amount: 0,
      type: ''
    },
    {
      from: '',
      to: '',
      assetIndex: 0,
      amount: 0,
      type: ''
    }
  ]);
  //////////////////////

  const createAtomicTransaction = async () => {
    try {
      await walletContext.functions.createAtomicTransaction(transactions);
    } catch (err) {
      showError(err);
    }
  };

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container spacing={4} className={classes.container}>
      {transactions.map((item, index) => (
        <GridCenter key={`transaction${index}`} item xs={12} md={6} className={classes.swapGrid}>
          <TransactionForm
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
          LET'S GO!
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
