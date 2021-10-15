import { Button, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import 'reflect-metadata';
import '../App.css';

import GridCenter from '../components/generic/GridCenter';
import TransactionForm from '../components/TransactionForm';
import WalletContext from '../components/WalletContextProvider';
import { HEADER_HEIGHT } from '../constants';
import { showError, showNotification } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import { useHistory } from 'react-router-dom';
import Loader from 'src/components/generic/Loader';
import ModalTermsOfService from 'src/components/ModalTermsOfService';

function CreateSwapPage() {
  const walletContext = useContext(WalletContext);

  const [loading, setLoading] = useState(false);
  const [openTermsOfService, setOpenTermsOfService] = useState(false);

  const classes = useStyles();

  const history = useHistory();

  // DEV /////////////
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
  ////////////////////

  // PRODUCTION //////////
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
  ///////////////////////

  const updateTransaction = (newTransaction: PartialTransaction, index: number) => {
    transactions[index] = newTransaction;

    if (index === 0) {
      if (transactions[1].from !== newTransaction.to) {
        transactions[1].from = newTransaction.to;
      }
      if (transactions[1].to !== newTransaction.from) {
        transactions[1].to = newTransaction.from;
      }
    } else {
      if (transactions[0].from !== newTransaction.to) {
        transactions[0].from = newTransaction.to;
      }
      if (transactions[0].to !== newTransaction.from) {
        transactions[0].to = newTransaction.from;
      }
    }

    setTransactions([...transactions]);
  };

  const createAtomicTransaction = async () => {
    setLoading(true);
    try {
      const tx = await walletContext.functions.createAtomicTransaction(transactions);
      history.replace(`/swapper/tx/${tx}`);
      showNotification('Atomic transaction created!');
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  if (!walletContext.selectedAccount) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={4} className={classes.container}>
      <ModalTermsOfService
        open={openTermsOfService}
        onAccept={() => {
          createAtomicTransaction();
          setOpenTermsOfService(false);
        }}
        onClose={() => {
          showError(new Error('Could not continue.'));
          setOpenTermsOfService(false);
        }}
      />

      <GridCenter key={`transaction${0}`} item xs={12} md={6} className={classes.swapGrid}>
        <TransactionForm
          title={"You'll Send"}
          index={0}
          transaction={transactions[0]}
          setTransaction={(t) => updateTransaction(t, 0)}
          forceSenderConnected
        />
      </GridCenter>
      <GridCenter key={`transaction${1}`} item xs={12} md={6} className={classes.swapGrid}>
        <TransactionForm
          title={"You'll Receive"}
          index={1}
          transaction={transactions[1]}
          setTransaction={(t) => updateTransaction(t, 1)}
          forceReceiverConnected
        />
      </GridCenter>

      <GridCenter item xs={12} style={{ marginTop: 20 }}>
        <Button variant={'contained'} onClick={() => setOpenTermsOfService(true)}>
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

export default CreateSwapPage;
