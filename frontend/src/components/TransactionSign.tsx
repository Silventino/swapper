import { Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import PartialTransaction from 'src/types/PartialTransaction';
import '../App.css';
import ConnectedWalletSelect from './generic/ConnectedWalletSelect';
import GridCenter from './generic/GridCenter';
import MyAddressInput from './generic/MyAddressInput';
import MyInput from './generic/MyInput';
import MyNumberInput from './generic/MyNumberInput';
import MySelect from './generic/MySelect';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';
import WalletContext, { AssetInfo } from './WalletContextProvider';

type Props = {
  index: number;
  transaction: PartialTransaction;
  setTransaction: (x: PartialTransaction) => void;
};

const TransactionSign: React.FC<Props> = (props) => {
  const { index, transaction, setTransaction } = props;
  const classes = useStyles();

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);

  const walletContext = useContext(WalletContext);

  useEffect(() => {
    const newAsset = walletContext.assets.find((item) => item.id === transaction.assetIndex);
    setSelectedAsset(newAsset ?? null);
  }, [transaction.assetIndex, walletContext.assets]);

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
    }
  })
);

export default TransactionSign;
