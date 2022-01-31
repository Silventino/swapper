import {Button, Divider, Grid, IconButton, TextField, Theme} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import React, {useContext, useEffect, useState} from 'react';
import 'reflect-metadata';
import {ALGO_ASSET, colors, EMPTY_PARTIAL_TRANSACTION} from 'src/constants';
import {getAssetImage, getAssetLabel, showNotification} from 'src/helpers/helper';
import PartialTransaction from 'src/types/PartialTransaction';
import '../App.css';
import GridCenter from './generic/GridCenter';
import MyNumberInput from './generic/MyNumberInput';
import Title from './generic/Title';
import WalletContext, {AssetInfo} from '../providers/WalletContextProvider';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import InfoIcon from '@mui/icons-material/Info';
import assetApi from "../api/assetApi";

type Props = {
  title: string;
  transactions: PartialTransaction[];
  setTransactions: (x: PartialTransaction[]) => void;

  id?: string;
};

const TransactionFormV2: React.FC<Props> = (props) => {
  const { transactions, setTransactions, title, id } = props;
  const classes = useStyles();

  const walletContext = useContext(WalletContext);

  const updateTransaction = (newTransaction: PartialTransaction, index: number) => {
    transactions[index] = newTransaction;
    setTransactions([...transactions]);
  };

  const removeTransaction = (index: number) => {
    let newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
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
          <Grid item xs={12} key={`${title}-${i}`}>
            <SingleTransaction
              transaction={item}
              setTransaction={(t) => updateTransaction(t, i)}
              canDelete={transactions.length > 1}
              onDelete={() => removeTransaction(i)}
              id={id? `${id}-${i}` : undefined}
            />
          </Grid>
        ))}

        <GridCenter item xs={12}>
          <Button
            id={id? `${id}-addAsset` : undefined}
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
  canDelete: boolean;
  onDelete: () => void;

  id?: string;
};

const SingleTransaction: React.FC<PropsSingle> = (props) => {
  const { transaction, setTransaction, canDelete, onDelete, id } = props;
  const walletContext = useContext(WalletContext);
  const classes = useStyles();

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);

  const [loading, setLoading] = useState(false);

  const loadAsset = async (assetId: string) => {
    assetId = assetId.replace(/\D/g, '');
    if (assetId.length !== 9) {
      return;
    }
    setLoading(true);
    try {
      const asset = await walletContext.loadAsset(assetId);
      if (asset) {
        onChangeAsset(asset)
      }
    } catch (err) {
      showNotification("Asset not found.")
    }
    setLoading(false);
  };

  const onChangeAsset = (asset: AssetInfo | null) => {
    setTransaction({ ...transaction, assetIndex: asset ? asset.id : 0 })
  }

  useEffect(() => {
    console.log("effect com walletContext", [transaction.assetIndex, walletContext.assets]);
    const loadAssetFromTransaction = async () => {
      try {
        let newAsset = walletContext.assets.find((item) => item.id === transaction.assetIndex);
        if (!newAsset) {
          newAsset = await assetApi.getAssetInfo(transaction.assetIndex);
        }
        setSelectedAsset(newAsset ?? ALGO_ASSET);
      } catch (err) {
        console.log(err);
        setSelectedAsset(null);
      }
    };

    if(walletContext.assets.length > 0){
      loadAssetFromTransaction();
    }
  }, [transaction.assetIndex, walletContext.assets]);

  const filterOptions = createFilterOptions({
    limit: 40
  });

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      <GridCenter item xs={12}>
          <div className={classes.divWithRemove}>
            <div style={{ width: 40, height: 40 }} />

            <a
              href={`https://www.nftexplorer.app/asset/${selectedAsset?.id}`}
              target={"_blank"}
              rel="noreferrer"
              className={classes.row}
            >
              <div style={{ width: 40, height: 40 }} />
              <img src={getAssetImage(selectedAsset)} alt="" className={classes.img} />
              {
                selectedAsset?.id === ALGO_ASSET.id ?
                <div style={{ width: 40, height: 40 }} />
                :
                <IconButton onClick={() => {}}>
                  <InfoIcon />
                </IconButton>
              }
            </a>

            <div className={classes.column}>
              {
                canDelete &&
                <IconButton onClick={() => onDelete()}>
                  <DeleteIcon />
                </IconButton>
              }
              <div style={{ width: 40, height: 40 }} />
            </div>

          </div>
      </GridCenter>

      <Grid item xs={12}>
        <Autocomplete
          id={id? `${id}-asset` : undefined}
          disablePortal
          options={ walletContext.assets }
          getOptionLabel={getAssetLabel}
          value={selectedAsset}
          onChange={(e, asset: AssetInfo | null) => onChangeAsset(asset)}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value.length === 9) {
                    loadAsset(value);
                  }
                }}
                label="Asset"
                helperText="Start typing to filter assets"
                disabled={loading}
              />
            );
          }}
          filterOptions={filterOptions as any}
          autoSelect
        />
      </Grid>

      <Grid item xs={12}>
        <MyNumberInput
          id={id? `${id}-amount` : undefined}
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
    },
    divWithRemove: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },
  })
);

export default TransactionFormV2;
