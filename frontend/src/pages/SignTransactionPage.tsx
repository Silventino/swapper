import { Button, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import 'reflect-metadata';
import transactionApi from 'src/api/transactionApi';
import Loader from 'src/components/generic/Loader';
import TransactionForm from 'src/components/TransactionForm';
import TransactionSign from 'src/components/TransactionSign';
import { showError, showNotification } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import '../App.css';
import GridCenter from '../components/generic/GridCenter';
import WalletContext from '../components/WalletContextProvider';
import Alert from '@material-ui/lab/Alert';

function SignTransactionPage() {
  let { id } = useParams<{ id: string }>();
  const walletContext = useContext(WalletContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const [transactions, setTransactions] = useState<CompleteTransaction[]>([]);
  const [allSigned, setAllSigned] = useState(false);

  const history = useHistory();

  const getTransaction = async () => {
    setLoading(true);
    try {
      if (!walletContext.selectedAccount) {
        throw new Error('Please connect your wallet first.');
      }
      const res = await transactionApi.getAtomicTransaction(walletContext.selectedAccount.address, id);
      await walletContext.functions.verifyGroup(id, res);
      setTransactions(res);
    } catch (err) {
      console.log(err);
      showError(err);
    }
    setLoading(false);
  };

  const finish = async () => {
    setLoading(true);
    try {
      if (!walletContext.selectedAccount) {
        throw new Error('Please connect your wallet first.');
      }
      const signed = transactions.map((item) => {
        if (!item.blob) {
          throw new Error('Unsigned transaction.');
        }
        return item.blob;
      });
      await walletContext.functions.sendTransactions(signed);
      showNotification('Sucess! Swap completed.');
      history.replace('/pacswap/success');
    } catch (err) {
      console.log(err);
      showError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (walletContext.selectedAccount) {
      getTransaction();
    }
  }, [walletContext.selectedAccount]);

  useEffect(() => {
    const newAllSigned = transactions.every((item) => Boolean(item.txID && item.blob));
    setAllSigned(newAllSigned);
  }, [transactions]);

  if (!walletContext.selectedAccount || !transactions.length) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={4} className={classes.container}>
      {allSigned && (
        <Grid item xs={12}>
          <Alert severity="success">
            All transactions signed! Send the atomic transaction in the end of this page.
          </Alert>
        </Grid>
      )}

      {!allSigned && (
        <Grid item xs={12}>
          <Alert severity="info">
            Share this page URL with the participants of this swap and you'll be able to complete it once all
            transactions are signed.
          </Alert>
        </Grid>
      )}

      {transactions.map((item, index) => (
        <GridCenter key={`transaction${index}`} item xs={12} md={6} className={classes.swapGrid}>
          <TransactionSign index={index} transaction={transactions[index]} onSign={() => getTransaction()} />
        </GridCenter>
      ))}

      {allSigned && (
        <GridCenter item xs={12}>
          <Button variant={'contained'} onClick={() => finish()}>
            FINISH TRANSACTION
          </Button>
        </GridCenter>
      )}

      {!allSigned && (
        <GridCenter item xs={12}>
          <Button variant={'contained'} onClick={() => getTransaction()}>
            REFRESH
          </Button>
        </GridCenter>
      )}
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      maxWidth: 'min(100vw, 1000px)',
      paddingBottom: 20
    },
    swapGrid: { marginTop: 10 }
  })
);

export default SignTransactionPage;
