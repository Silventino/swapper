import { Button, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import transactionApi from 'src/api/transactionApi';
import { colors } from 'src/constants';
import { showError } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import '../App.css';
import GridCenter from './generic/GridCenter';
import Loader from './generic/Loader';
import MyInput from './generic/MyInput';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';
import WalletContext, { AssetInfo } from './WalletContextProvider';

type Props = {
  index: number;
  transaction: CompleteTransaction;
  onSign: () => void;
};

const TransactionSign: React.FC<Props> = (props) => {
  const { index, transaction, onSign } = props;
  const classes = useStyles();

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);
  const [optedIn, setOptedIn] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const walletContext = useContext(WalletContext);

  const getAsset = async () => {
    setLoading(true);
    try {
      const newAsset = await walletContext.functions.getAssetInfo(transaction.assetIndex as any);
      setSelectedAsset(newAsset ?? null);
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  const signTransaction = async () => {
    setLoading(true);
    try {
      if (!walletContext.selectedAccount) {
        return;
      }
      const signed = await walletContext.functions.signTransaction(transaction);
      await transactionApi.signTransaction(walletContext.selectedAccount.address, signed);
      onSign();
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  const optinAsset = async () => {
    setLoading(true);
    try {
      if (!walletContext.selectedAccount) {
        return;
      }
      await walletContext.functions.optinAsset(transaction.assetIndex!);
      onSign();
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const newOptedIn = walletContext.assets.some((item) => item.id === transaction.assetIndex);
    setOptedIn(newOptedIn);

    getAsset();
  }, [transaction.assetIndex, walletContext.assets]);

  useEffect(() => {
    const newIsPaticipating = walletContext.selectedAccount?.address === transaction.from;
    setIsParticipating(newIsPaticipating);

    const newIsSigned = Boolean(transaction.txID && transaction.blob);
    setIsSigned(newIsSigned);
  }, [walletContext.accounts, transaction]);

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container className={clsx(classes.container, 'rainbow-box')} spacing={4}>
      <GridCenter item xs={12}>
        <Title variant={'h4'}>{`Transaction #${index + 1}`}</Title>
      </GridCenter>

      <GridCenter item xs={12}>
        <img
          src={selectedAsset?.url ?? 'https://jsvasconcelos.pt/images/Icon/imageNotFound.png'}
          alt=""
          className={classes.img}
        />
      </GridCenter>

      <Grid item xs={12}>
        <MyInput label={'Asset'} value={selectedAsset?.assetname ?? ''} onChange={(asset) => {}} disabled />
      </Grid>

      <Grid item xs={12}>
        <MyInput label={'From'} value={transaction.from} onChange={(txt) => {}} disabled />
      </Grid>
      <Grid item xs={12}>
        <MyInput label={'To'} value={transaction.to} onChange={(txt) => {}} disabled />
      </Grid>

      <Grid item xs={12}>
        <MyInput label={'Amount'} fullWidth value={transaction.amount.toString()} onChange={(txt) => {}} disabled />
      </Grid>

      {loading && (
        <GridCenter item xs={12}>
          <div className={classes.loaderDiv}>
            <Loader size={20} />
          </div>
        </GridCenter>
      )}

      {!loading && optedIn && (
        <GridCenter item xs={12}>
          <Button variant={'contained'} onClick={signTransaction} disabled={!isParticipating || isSigned}>
            {isSigned ? 'SIGNED!' : 'SIGN'}
          </Button>
        </GridCenter>
      )}

      {!loading && !optedIn && (
        <GridCenter item xs={12}>
          <Button variant={'contained'} onClick={optinAsset}>
            OPT-IN
          </Button>
        </GridCenter>
      )}
    </Grid>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      maxWidth: 400,
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center'
    },
    img: {
      width: 200,
      height: 200,
      objectFit: 'contain',
      borderRadius: 7
    },
    loaderDiv: { width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  })
);

export default TransactionSign;
