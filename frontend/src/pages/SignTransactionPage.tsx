import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'reflect-metadata';
import transactionApi from 'src/api/transactionApi';
import Loader from 'src/components/generic/Loader';
import TransactionForm from 'src/components/TransactionForm';
import TransactionSign from 'src/components/TransactionSign';
import CompleteTransaction from 'src/types/CompleteTransaction';
import '../App.css';
import GridCenter from '../components/generic/GridCenter';
import WalletContext from '../components/WalletContextProvider';

function SignTransactionPage() {
  let { id } = useParams<{ id: string }>();
  const walletContext = useContext(WalletContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const [transactions, setTransactions] = useState<CompleteTransaction[]>([]);

  const getTransaction = async () => {
    setLoading(true);
    try {
      const res = await transactionApi.getAtomicTransaction(id);
      setTransactions(res);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    if (walletContext.selectedAccount) {
      getTransaction();
    }
  }, [walletContext.selectedAccount]);

  if (!walletContext.selectedAccount) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={4} className={classes.container}>
      {transactions.map((item, index) => (
        <GridCenter key={`transaction${index}`} item xs={12} md={6} className={classes.swapGrid}>
          <TransactionSign index={index} transaction={transactions[index]} setTransaction={(t) => {}} />
        </GridCenter>
      ))}
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

export default SignTransactionPage;
