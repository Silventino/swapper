import { Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import AssetPreview from 'src/components/AssetPreview';
import MyAddressInput from 'src/components/generic/MyAddressInput';
import { colors } from 'src/constants';
import WalletContext, { AssetInfo } from 'src/providers/WalletContextProvider';
import '../../App.css';
import GridCenter from '../../components/generic/GridCenter';

function OptoutPage() {
  const classes = useStyles();
  const walletContext = useContext(WalletContext);
  const [address, setAddress] = useState(walletContext.selectedAccount?.address ?? '');
  const [assets, setAssets] = useState<AssetInfo[]>([]);

  useEffect(() => {
    if (address) {
      walletContext.getAssetsFromAddress(address, true).then((newAssets) => {
        newAssets = newAssets.filter((item) => item.id !== 0);
        setAssets(newAssets);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, walletContext.getAssetsFromAddress]);

  return (
    <Grid container className={classes.container}>
      <GridCenter item xs={12} className={classes.swapGrid}>
        <Typography className={classes.medtxt}>Gallery</Typography>
      </GridCenter>

      <GridCenter item xs={12}>
        <MyAddressInput label={'Address'} fullWidth value={address} onChange={setAddress} />
      </GridCenter>

      {assets.map((item) => (
        <Grid item xs={12} sm={6} md={4}>
          <AssetPreview asset={item} />
        </Grid>
      ))}
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
