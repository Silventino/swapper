import { Button, Divider, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors, EMPTY_PARTIAL_TRANSACTION } from 'src/constants';
import { getAssetImage } from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import '../App.css';
import GridCenter from './generic/GridCenter';
import MyNumberInput from './generic/MyNumberInput';
import MySelect from './generic/MySelect';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';
import WalletContext, { AssetInfo } from './WalletContextProvider';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  title: string;
  transactions: PartialTransaction[];
  setTransactions: (x: PartialTransaction[]) => void;
};

const TransactionFormV2: React.FC<Props> = (props) => {
  const { transactions, setTransactions, title } = props;
  const classes = useStyles();

  const walletContext = useContext(WalletContext);

  const updateTransaction = (newTransaction: PartialTransaction, index: number) => {
    transactions[index] = newTransaction;
    setTransactions([...transactions]);
  };

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <GridCenter item xs={12}>
          <Title variant={'h4'}>{title}</Title>
        </GridCenter>

        {transactions.map((item, i) => (
          <Grid item xs={12}>
            <SingleTransaction transaction={item} setTransaction={(t) => updateTransaction(t, i)} />
          </Grid>
        ))}

        <GridCenter item xs={12}>
          <Button
            startIcon={<AddIcon />}
            variant={'contained'}
            onClick={() => setTransactions([...transactions, { ...EMPTY_PARTIAL_TRANSACTION }])}
          >
            ADD ANOTHER ASSET
          </Button>
        </GridCenter>
      </Grid>
    </div>
  );
};

type PropsSingle = {
  transaction: PartialTransaction;
  setTransaction: (x: PartialTransaction) => void;
};

const SingleTransaction: React.FC<PropsSingle> = (props) => {
  const { transaction, setTransaction } = props;
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
    <Grid container spacing={3}>
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
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