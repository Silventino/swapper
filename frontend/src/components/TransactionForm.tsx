import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { getAssetImage } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import '../App.css';
import ConnectedWalletSelect from './generic/ConnectedWalletSelect';
import GridCenter from './generic/GridCenter';
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
  title?: string;
  forceSenderConnected?: boolean;
  forceReceiverConnected?: boolean;
};

const TransactionForm: React.FC<Props> = (props) => {
  const { index, transaction, setTransaction, title, forceSenderConnected, forceReceiverConnected } = props;
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
        <Title variant={'h4'}>{title ?? `Transaction #${index + 1}`}</Title>
      </GridCenter>

      <GridCenter item xs={12}>
        <img src={getAssetImage(selectedAsset)} alt="" className={classes.img} />
      </GridCenter>

      <Grid item xs={12}>
        <MySelect<AssetInfo>
          label={'Asset'}
          options={walletContext.assets}
          getOptionLabel={(item) => (item ? `${item.assetname} (${item.unitname})` : '')}
          // getOptionLabel={(item) => (item ? `${item.assetname} (ID ${item.id})` : '')}
          value={selectedAsset}
          onChange={(asset) => setTransaction({ ...transaction, assetIndex: asset.id })}
        />
      </Grid>

      <Grid item xs={12}>
        {forceSenderConnected ? (
          <ConnectedWalletSelect
            label={'From'}
            value={transaction.from}
            onChange={(txt) => setTransaction({ ...transaction, from: txt })}
          />
        ) : (
          <MyInput
            label={'From'}
            value={transaction.from}
            onChange={(txt) => setTransaction({ ...transaction, from: txt })}
            multiline
          />
        )}
      </Grid>
      <Grid item xs={12}>
        {forceReceiverConnected ? (
          <ConnectedWalletSelect
            label={'To'}
            value={transaction.to}
            onChange={(txt) => setTransaction({ ...transaction, to: txt })}
          />
        ) : (
          <MyInput
            label={'To'}
            value={transaction.to}
            onChange={(txt) => setTransaction({ ...transaction, to: txt })}
            multiline
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <MyNumberInput
          label={'Amount'}
          fullWidth
          decimalScale={selectedAsset ? selectedAsset.decimals : 0}
          value={transaction.amount}
          onChange={(txt) => setTransaction({ ...transaction, amount: txt })}
        />
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

export default TransactionForm;
