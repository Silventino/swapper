import { Button, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import Alert from '@material-ui/core/Alert';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import 'reflect-metadata';
import swapApi from 'src/api/swapApi';
import AssetOptIn from 'src/components/AssetOptIn';
import Loader from 'src/components/generic/Loader';
import TransactionSign from 'src/components/TransactionSign';
import { showError, showNotification } from 'src/helpers/helper';
import Swap from 'src/types/Swap';
import '../App.css';
import GridCenter from '../components/generic/GridCenter';
import WalletContext from '../components/WalletContextProvider';

function SignTransactionPage() {
  let { id } = useParams<{ id: string }>();
  const walletContext = useContext(WalletContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const [swap, setSwap] = useState<null | Swap>(null);

  const [allSigned, setAllSigned] = useState(false);
  const [allMineSigned, setAllMineSigned] = useState(false);

  const [notOptedInAssets, setNotOptedInAssets] = useState<number[]>([]);

  const history = useHistory();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showNotification('URL copied to clipboard!');
    } catch (err: any) {
      showError(err);
    }
  };

  const getTransaction = async (showLoader: boolean = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      if (!walletContext.selectedAccount) {
        throw new Error('Please connect your wallet first.');
      }
      const newSwap = await swapApi.getSwap(walletContext.selectedAccount.address, id);

      if (newSwap.completed) {
        history.replace('/success');
        return true;
      }

      await walletContext.functions.verifyGroup(id, newSwap.transactions);
      setSwap(newSwap);
    } catch (err: any) {
      console.log(err);
      showError(err);
    }
    if (showLoader) {
      setLoading(false);
    }
  };

  const finish = async () => {
    setLoading(true);
    try {
      if (!swap) {
        throw new Error('Swap not found.');
      }
      if (!walletContext.selectedAccount) {
        throw new Error('Please connect your wallet first.');
      }
      const signed = swap.transactions.map((item) => {
        if (!item.blob) {
          throw new Error('Unsigned transaction.');
        }
        return item.blob;
      });

      await walletContext.functions.sendTransactions(signed);
      await swapApi.completeSwap(walletContext.selectedAccount.address, swap!.txId);
      showNotification('Sucess! Swap completed.');
      history.replace('/success');
    } catch (err: any) {
      console.log(err);

      if (err.response?.body?.message) {
        let message = err.response.body.message as string;
        if (message.search('transaction already in ledger') !== -1) {
          history.replace('/success');
        }
      }

      showError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (walletContext.selectedAccount) {
      getTransaction();
    }
  }, [walletContext.selectedAccount]);

  const loop = async () => {
    if (window.location.href.search('success') !== -1) {
      return;
    }
    console.log('Reloading!');

    const completed = await getTransaction(false);
    if (completed === true) {
      return;
    }
    setTimeout(() => {
      loop();
    }, 5 * 1000);
  };

  const verifySteps = () => {
    if (swap) {
      const newAllSigned = swap.transactions.every((item) => Boolean(item.txID && item.blob));

      const myTransactions = swap.transactions.filter((item) =>
        Boolean(walletContext.selectedAccount && item.from === walletContext.selectedAccount.address)
      );
      const newAllMineSigned = myTransactions.every((item) => Boolean(item.txID && item.blob));

      const newNotOptedInAssets: number[] = [];
      for (let i = 0; i < swap.transactions.length; i++) {
        const transaction = swap.transactions[i];
        const opted = walletContext.assets.some((asset) => asset.id === transaction.assetIndex);
        if (!opted && transaction.assetIndex) {
          newNotOptedInAssets.push(transaction.assetIndex);
        }
      }

      setNotOptedInAssets(newNotOptedInAssets);
      setAllSigned(newAllSigned);
      setAllMineSigned(newAllMineSigned);
    }
  };

  useEffect(() => {
    if (walletContext.selectedAccount) {
      loop();
    }
  }, [walletContext.selectedAccount]);

  useEffect(() => {
    verifySteps();
  }, [swap]);

  if (!walletContext.selectedAccount || !swap || !swap.transactions.length) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  if (notOptedInAssets.length > 0) {
    // step 0: opt-in
    return (
      <Grid container spacing={4} justifyContent={'center'} className={classes.container}>
        <Grid item xs={12}>
          <Alert severity="info">You need to opt-in these assets before continuing.</Alert>
        </Grid>

        {notOptedInAssets.map((assetIndex, index) => (
          <GridCenter key={`transaction${index}`} item xs={12} md={6} className={classes.swapGrid}>
            <AssetOptIn assetIndex={assetIndex} onOptIn={() => {}} />
          </GridCenter>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={4} justifyContent={'center'} className={classes.container}>
      {allSigned && (
        <Grid item xs={12}>
          <Alert severity="success">
            All transactions signed! Finish the atomic transaction in the end of this page.
          </Alert>
        </Grid>
      )}

      {!allSigned && !allMineSigned && (
        <Grid item xs={12}>
          <Alert severity="info">
            First, sign all transactions that have the "Sign" button available. Don't worry, none of the assets will
            leave your wallet untill everything is complete.
          </Alert>
        </Grid>
      )}

      {!allSigned && allMineSigned && (
        <Grid item xs={12}>
          <Alert
            severity="info"
            action={
              <Button variant="contained" size="small" onClick={() => copyToClipboard()}>
                COPY URL
              </Button>
            }
          >
            Share this page URL with the other participant of this swap and you'll be able to complete it once all
            transactions are signed.
          </Alert>
        </Grid>
      )}

      {swap.transactions.map((item, index) => (
        <GridCenter key={`transaction${index}`} item xs={12} md={6} className={classes.swapGrid}>
          <TransactionSign index={index} transaction={swap.transactions[index]} onSign={() => getTransaction()} />
        </GridCenter>
      ))}

      {allSigned && (
        <GridCenter item xs={12} className={classes.buttonDiv}>
          <Button variant={'contained'} onClick={() => finish()}>
            FINISH TRANSACTION
          </Button>
        </GridCenter>
      )}

      {!allSigned && (
        <GridCenter item xs={12} className={classes.buttonDiv}>
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
    swapGrid: { marginTop: 10 },
    buttonDiv: { marginTop: 10 }
  })
);

export default SignTransactionPage;
