import { Button, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext, useState } from 'react';
import 'reflect-metadata';
import '../../App.css';

import GridCenter from '../../components/generic/GridCenter';
import TransactionFormV2 from '../../components/TransactionFormV2';
import WalletContext from '../../providers/WalletContextProvider';
import { ALGO_ASSET, EMPTY_PARTIAL_TRANSACTION } from '../../constants';
import { showError, showNotification, useLocalStorage } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import { useHistory } from 'react-router-dom';
import Loader from 'src/components/generic/Loader';
import ModalTermsOfService from 'src/components/ModalTermsOfService';
import AddressForm from 'src/components/AddressForm';
import { setTimeout } from 'timers';
import CheckboxDonation, { DonationInfo } from '../../components/CheckboxDonation';

function CreateSwapPage() {
  const walletContext = useContext(WalletContext);

  const [loading, setLoading] = useState(false);

  const [donationInfo, setDonationInfo] = useState<DonationInfo>({
    willDonate: true,
    asset: ALGO_ASSET,
    amount: 0.5
  });

  const [openTermsOfService, setOpenTermsOfService] = useState(false);

  const classes = useStyles();

  const history = useHistory();

  const [addressA, setAddressA] = useState(walletContext.selectedAccount?.address ?? '');
  const [addressB, setAddressB] = useState('');
  const [minutes, setMinutes] = useLocalStorage('TimeLimit', 30);

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

      const tx = await walletContext.createAtomicTransaction(allTransactions, donationInfo, minutes);
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
          <AddressForm
            addressA={addressA}
            setAddressA={setAddressA}
            addressB={addressB}
            setAddressB={setAddressB}
            minutes={minutes}
            setMinutes={setMinutes}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TransactionFormV2
            title={"You'll Send"}
            transactions={transactionsA}
            setTransactions={(t) => setTransactionsA([...t])}
            id={'personA'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TransactionFormV2
            title={"You'll Receive"}
            transactions={transactionsB}
            setTransactions={(t) => setTransactionsB([...t])}
            id={'personB'}
          />
        </Grid>

        <GridCenter item xs={12}>
          <CheckboxDonation donationInfo={donationInfo} setDonationInfo={setDonationInfo} />
        </GridCenter>

        <GridCenter item xs={12}>
          <Button
            id={'btn-letsgo'}
            variant={'contained'}
            onClick={() => setOpenTermsOfService(true)}
            style={{ marginBottom: 35 }}
          >
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
      maxWidth: 'min(100vw, 1000px)'
    },
    swapGrid: { marginTop: 10 }
  })
);

export default CreateSwapPage;
