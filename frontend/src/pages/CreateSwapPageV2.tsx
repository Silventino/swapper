import { Button, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext, useState } from 'react';
import 'reflect-metadata';
import '../App.css';

import GridCenter from '../components/generic/GridCenter';
import TransactionFormV2 from '../components/TransactionFormV2';
import WalletContext from '../providers/WalletContextProvider';
import { EMPTY_PARTIAL_TRANSACTION, HEADER_HEIGHT } from '../constants';
import { showError, showNotification } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import { useHistory } from 'react-router-dom';
import Loader from 'src/components/generic/Loader';
import ModalTermsOfService from 'src/components/ModalTermsOfService';
import AddressForm from 'src/components/AddressForm';
import { setTimeout } from 'timers';

function CreateSwapPageV2() {
  const walletContext = useContext(WalletContext);

  const [loading, setLoading] = useState(false);
  const [openTermsOfService, setOpenTermsOfService] = useState(false);

  const classes = useStyles();

  const history = useHistory();

  const [addressA, setAddressA] = useState(walletContext.selectedAccount?.address ?? '');
  const [addressB, setAddressB] = useState('');

  const [transactionsA, setTransactionsA] = useState<PartialTransaction[]>([{ ...EMPTY_PARTIAL_TRANSACTION }]);

  const [transactionsB, setTransactionsB] = useState<PartialTransaction[]>([{ ...EMPTY_PARTIAL_TRANSACTION }]);

  const createAtomicTransaction = async () => {
    const hasZeroTransactionsA = transactionsA.some((item) => item.amount <= 0);
    const hasZeroTransactionsB = transactionsB.some((item) => item.amount <= 0);
    if (hasZeroTransactionsA || hasZeroTransactionsB) {
      showNotification('Transactions with 0 amount are not allowed.');
      return;
    }

    setLoading(true);
    try {
      const newTransactionsA = transactionsA.map((item) => {
        item.from = addressA;
        item.to = addressB;
        return item;
      });
      const newTransactionsB = transactionsB.map((item) => {
        item.from = addressB;
        item.to = addressA;
        return item;
      });
      const allTransactions = newTransactionsA.concat(newTransactionsB);

      console.log('allTransactions', allTransactions);

      const tx = await walletContext.functions.createAtomicTransaction(allTransactions);
      setTimeout(() => {
        history.replace(`/tx/${tx}`);
        showNotification('Swap created!');
        setLoading(false);
      }, 1500);
    } catch (err) {
      showError(err);
      setLoading(false);
    }
  };

  if (!walletContext.selectedAccount) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
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
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12} className={classes.swapGrid}>
          <AddressForm addressA={addressA} setAddressA={setAddressA} addressB={addressB} setAddressB={setAddressB} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TransactionFormV2
            title={"You'll Send"}
            transactions={transactionsA}
            setTransactions={(t) => setTransactionsA([...t])}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionFormV2
            title={"You'll Receive"}
            transactions={transactionsB}
            setTransactions={(t) => setTransactionsB([...t])}
          />
        </Grid>

        <GridCenter item xs={12} style={{ marginTop: 20 }}>
          <Button variant={'contained'} onClick={() => setOpenTermsOfService(true)}>
            LET'S GO!
          </Button>
        </GridCenter>
      </Grid>
    </>
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

export default CreateSwapPageV2;
