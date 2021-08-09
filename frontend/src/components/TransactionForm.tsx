import { Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import PartialTransaction from 'src/types/PartialTransaction';
import '../App.css';
import ConnectedWalletSelect from './generic/ConnectedWalletSelect';
import GridCenter from './generic/GridCenter';
import MyAddressInput from './generic/MyAddressInput';
import MyNumberInput from './generic/MyNumberInput';
import MySelect from './generic/MySelect';
import RainbowDiv from './generic/RainbowDiv';
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

  const [disabled, setDisabled] = useState(false);
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
    <Grid container className={classes.container} spacing={4}>
      <GridCenter item xs={12}>
        <Title variant={'h4'}>{title ?? `Transaction #${index + 1}`}</Title>
      </GridCenter>

      <GridCenter item xs={12}>
        <img
          src={selectedAsset?.url ?? 'https://jsvasconcelos.pt/images/Icon/imageNotFound.png'}
          alt=""
          className={classes.img}
        />
      </GridCenter>

      <Grid item xs={12}>
        <MySelect<AssetInfo>
          label={'Asset'}
          options={walletContext.assets}
          getOptionLabel={(item) => (item ? `${item.assetname}` : '')}
          // getOptionLabel={(item) => (item ? `${item.assetname} (ID ${item.id})` : '')}
          value={selectedAsset}
          onChange={(asset) => setTransaction({ ...transaction, assetIndex: asset.id })}
        />
      </Grid>

      <Grid item xs={12}>
        {forceSenderConnected ? (
          <ConnectedWalletSelect
            label={'Sender Address'}
            value={transaction.from}
            onChange={(txt) => setTransaction({ ...transaction, from: txt })}
          />
        ) : (
          <MyAddressInput
            label={'Sender Address'}
            value={transaction.from}
            onChange={(txt) => setTransaction({ ...transaction, from: txt })}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        {forceReceiverConnected ? (
          <ConnectedWalletSelect
            label={'Receiver Address'}
            value={transaction.to}
            onChange={(txt) => setTransaction({ ...transaction, to: txt })}
          />
        ) : (
          <MyAddressInput
            label={'Receiver Address'}
            value={transaction.to}
            onChange={(txt) => setTransaction({ ...transaction, to: txt })}
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
      backgroundColor: '#282c34',
      // width: "300px",
      // minHeight: "400px",
      maxWidth: 400,
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center'
      // marginTop: 50,
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
