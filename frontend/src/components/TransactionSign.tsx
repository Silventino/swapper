import { Button, Grid, IconButton, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import swapApi from 'src/api/swapApi';
import { ALGO_ASSET, colors } from 'src/constants';
import { getAssetImage, showError } from 'src/helpers/helper';
import CompleteTransaction from 'src/types/CompleteTransaction';
import '../App.css';
import GridCenter from './generic/GridCenter';
import Loader from './generic/Loader';
import MyInput from './generic/MyInput';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';
import WalletContext, { AssetInfo } from '../providers/WalletContextProvider';
import InfoIcon from '@mui/icons-material/Info';
import assetApi from '../api/assetApi';
import ImgWithLoader from './ImgWithLoader';
import VerifiedMark from './VerifiedMark';

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
  const [isOwner, setIsOwner] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const walletContext = useContext(WalletContext);

  const signTransaction = async () => {
    setLoading(true);
    try {
      const signed = await walletContext.signTransaction(transaction);
      await swapApi.signTransaction(signed);
      onSign();
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('effect com walletContext.2');
    const getAsset = async () => {
      setLoading(true);
      try {
        let newAsset;
        if (!transaction.assetIndex) {
          newAsset = ALGO_ASSET;
        } else {
          newAsset = await assetApi.getAssetInfo(transaction.assetIndex);
        }
        setSelectedAsset(newAsset ?? null);
      } catch (err) {
        showError(err);
      }
      setLoading(false);
    };

    if (!transaction.assetIndex) {
      setOptedIn(true);
    } else {
      const newOptedIn = walletContext.accountAssets.some((item) => item.id === transaction.assetIndex);
      setOptedIn(newOptedIn);
    }
    getAsset();
  }, [transaction.assetIndex, walletContext.accountAssets]);

  useEffect(() => {
    const newIsPaticipating = walletContext.selectedAccount?.address === transaction.from;
    setIsOwner(newIsPaticipating);

    const newIsSigned = Boolean(transaction.txID && transaction.blob);
    setIsSigned(newIsSigned);
  }, [walletContext.accounts, walletContext.selectedAccount?.address, transaction]);

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <div className={clsx(classes.container)}>
      <Grid container spacing={4}>
        <GridCenter item xs={12}>
          <Title variant={'h4'}>{`Transaction #${index + 1}`}</Title>
        </GridCenter>

        <GridCenter item xs={12}>
          <a href={`https://www.nftexplorer.app/asset/${selectedAsset?.id}`} target={'_blank'} rel="noreferrer">
            <div className={classes.row}>
              <div style={{ width: 40, height: 40 }} />
              <ImgWithLoader src={getAssetImage(selectedAsset)} alt="" className={classes.img} />
              {selectedAsset?.id === ALGO_ASSET.id ? (
                <div style={{ width: 40, height: 40 }} />
              ) : (
                <IconButton onClick={() => {}}>
                  <InfoIcon />
                </IconButton>
              )}
            </div>

            <VerifiedMark assetId={transaction.assetIndex ?? 0} />
          </a>
        </GridCenter>

        <Grid item xs={12}>
          <MyInput label={'Asset'} value={selectedAsset?.assetname ?? ''} onChange={(asset) => {}} disabled multiline />
        </Grid>

        <Grid item xs={12}>
          <MyInput label={'From'} value={transaction.from} onChange={(txt) => {}} disabled multiline />
        </Grid>
        <Grid item xs={12}>
          <MyInput label={'To'} value={transaction.to} onChange={(txt) => {}} disabled multiline />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            label={'Amount'}
            fullWidth
            value={(transaction.amount / Math.pow(10, selectedAsset?.decimals ?? 0)).toString()}
            onChange={(txt) => {}}
            disabled
          />
        </Grid>

        {loading && (
          <GridCenter item xs={12}>
            <div className={classes.loaderDiv}>
              <Loader size={20} />
            </div>
          </GridCenter>
        )}

        {!loading && !isOwner && !isSigned && (
          <GridCenter item xs={12}>
            <Button variant={'contained'} onClick={() => {}} disabled>
              NOT SIGNED
            </Button>
          </GridCenter>
        )}

        {!loading && optedIn && !isSigned && isOwner && (
          <GridCenter item xs={12}>
            <Button variant={'contained'} onClick={signTransaction} disabled={isSigned}>
              SIGN
            </Button>
          </GridCenter>
        )}

        {!loading && optedIn && isSigned && (
          <GridCenter item xs={12}>
            <Button variant={'contained'} onClick={signTransaction} disabled={isSigned}>
              SIGNED!
            </Button>
          </GridCenter>
        )}
      </Grid>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      borderRadius: '5px',
      padding: 20
    },
    img: {
      width: 200,
      height: 200,
      objectFit: 'contain',
      borderRadius: 7
    },
    loaderDiv: { width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }
  })
);

export default TransactionSign;
