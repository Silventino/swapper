import { Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { getAssetImage } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import '../App.css';
import GridCenter from './generic/GridCenter';
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
};

const TransactionFormV2: React.FC<Props> = (props) => {
  const { index, transaction, setTransaction, title } = props;
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
    <div className={classes.container}>
      <Grid container spacing={3}>
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
          <MyNumberInput
            label={'Amount'}
            fullWidth
            decimalScale={selectedAsset ? selectedAsset.decimals : 0}
            value={transaction.amount}
            onChange={(txt) => setTransaction({ ...transaction, amount: txt })}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      padding: '0px 20px 20px 20px',
      borderRadius: '5px',
      paddingTop: 20
    },
    img: {
      width: 200,
      height: 200,
      objectFit: 'contain',
      borderRadius: 7
    }
  })
);

export default TransactionFormV2;
