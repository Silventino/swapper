import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React, { useContext } from 'react';
import 'reflect-metadata';
import '../App.css';
import GridCenter from '../components/generic/GridCenter';
import WalletContext from '../components/WalletContextProvider';

function SignTransactionPage() {
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container spacing={4} className={classes.container}>
      <GridCenter item xs={12} style={{ marginTop: 20 }}>
        <p>OIEE</p>
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

export default SignTransactionPage;
