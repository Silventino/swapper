import { Button, Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import Loader from 'src/components/generic/Loader';
import { colors } from 'src/constants';
import { showError, showNotification } from 'src/helpers/helper';
import WalletContext, { AssetInfo } from 'src/providers/WalletContextProvider';
import '../../App.css';
import GridCenter from '../../components/generic/GridCenter';
import AssetOptoutPreview from './AssetOptoutPreview';

function OptoutPage() {
  const classes = useStyles();
  const walletContext = useContext(WalletContext);

  const [emptyAssets, setEmptyAssets] = useState<AssetInfo[]>([]);
  const [checkControl, setCheckControl] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletContext.selectedAccount) {
      return;
    }

    const newAssets: AssetInfo[] = [];
    const emptyIds = walletContext.selectedAccount.assets
      .filter((item) => item.amount === 0)
      .map((item) => item['asset-id']);

    for (let i = 0; i < emptyIds.length; i++) {
      let assetId = emptyIds[i];
      if (assetId && !isNaN(assetId)) {
        const asset = walletContext.assets.find((item) => item.id === assetId);
        if (asset) {
          newAssets.push(asset);
        }
      }
    }

    const newCheckControl = newAssets.map((item) => false);
    setCheckControl(newCheckControl);
    setEmptyAssets(newAssets);
  }, [walletContext.selectedAccount]);

  const completeOptout = async () => {
    setLoading(true);
    try {
      const assetsToOptout = emptyAssets.filter((item, index) => checkControl[index]);
      await walletContext.optoutAssets(assetsToOptout);
      showNotification('Opt-out transaction completed.');
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  const selectAll = () => {
    const max = Math.min(emptyAssets.length, 64);
    for (let i = 0; i < max; i++) {
      checkControl[i] = true;
    }
    setCheckControl([...checkControl]);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.medtxt}>Asset Opt-Out</Typography>
      </GridCenter>

      <GridCenter item xs={12} style={{ marginBottom: 10 }}>
        <Button variant={'contained'} onClick={selectAll}>
          {emptyAssets.length <= 64 ? 'Select all' : 'Select first 64'}
        </Button>
      </GridCenter>

      {emptyAssets.map((item, index) => (
        <Grid item xs={12} md={6} key={item.id}>
          <AssetOptoutPreview
            asset={item}
            onClick={() => {
              checkControl[index] = !checkControl[index];
              setCheckControl([...checkControl]);
            }}
            checked={checkControl[index]}
          />
        </Grid>
      ))}

      <GridCenter item xs={12}>
        <Button startIcon={<DeleteIcon />} variant={'contained'} onClick={() => completeOptout()}>
          OPTOUT
        </Button>
      </GridCenter>
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      padding: '0px 20px 20px 20px',
      borderRadius: '5px',
      // paddingTop: 20,
      // maxWidth: '100vw',
      maxWidth: 700
    },
    swapGrid: {
      marginTop: 10
      // padding: 15
    },
    bigtxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 100,
      color: '#fff',
      textAlign: 'center'
    },
    medtxt: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 20,
      fontSize: 30,
      color: '#fff',
      textAlign: 'center'
    },
    smalltxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 20,
      color: '#fff',
      textAlign: 'center'
    },
    qr: {
      width: 300,
      height: 300,
      margin: 15,
      borderRadius: 10
    },
    btn: {
      marginTop: 20
    }
  })
);

export default OptoutPage;
