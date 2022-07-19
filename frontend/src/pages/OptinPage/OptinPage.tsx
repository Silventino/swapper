import { Button, Grid, TextField, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'reflect-metadata';
import AssetPreview from 'src/components/AssetPreview';
import Loader from 'src/components/generic/Loader';
import { colors } from 'src/constants';
import { showError, showNotification } from 'src/helpers/helper';
import WalletContext, { AssetInfo } from 'src/providers/WalletContextProvider';
import '../../App.css';
import GridCenter from '../../components/generic/GridCenter';

function OptinPage() {
  const classes = useStyles();
  const walletContext = useContext(WalletContext);

  const [assetsToOptin, setAssetsToOptin] = useState<AssetInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');
  let { urlIds } = useParams<{ urlIds: undefined | string }>();

  const parseSearchTxt = async (txt?: string) => {
    try {
      const txtToParse = txt ?? searchTxt;
      let newAssets: AssetInfo[] = [];
      const cleaning = txtToParse.split(',').map((item) => item.replace(/\D/g, ''));
      const ids = [...new Set(cleaning)];

      for (let i = 0; i < ids.length; i++) {
        let assetId = parseInt(ids[i]);
        if (assetId && !isNaN(assetId)) {
          const index = walletContext.selectedAccount?.assets.findIndex((item) => item['asset-id'] === assetId);
          if (index === -1) {
            const asset = await walletContext.loadAsset(assetId.toString());
            newAssets.push(asset);
          } else {
            showNotification(`Asset #${assetId} is already in the wallet.`);
          }
        }
      }

      if (newAssets.length) {
        newAssets = newAssets.filter((item) => assetsToOptin.findIndex((item2) => item.id === item2.id) === -1);
        setAssetsToOptin([...assetsToOptin, ...newAssets]);
      }
    } catch {}

    setSearchTxt('');
  };

  useEffect(() => {
    if (urlIds) {
      parseSearchTxt(urlIds);
    }
  }, [urlIds]);

  const completeOptin = async () => {
    try {
      setLoading(true);
      const ids = assetsToOptin.map((item) => item.id);
      await walletContext.optinAssets(ids);
      setLoading(false);
      showNotification('Opt-in transaction completed.');
      setAssetsToOptin([]);
      setSearchTxt('');
    } catch (err) {
      showError(err);
      setLoading(false);
    }
  };

  const onDelete = (asset: AssetInfo) => {
    const newAssets = assetsToOptin.filter((item) => item.id !== asset.id);
    setAssetsToOptin(newAssets);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.medtxt}>Asset Opt-In</Typography>
      </GridCenter>

      {!urlIds && (
        <Grid item xs={12} style={{ marginBottom: 5 }}>
          <TextField
            fullWidth
            value={searchTxt}
            onChange={(e) => {
              let value = e.target.value;
              setSearchTxt(value);
            }}
            label="Asset"
            helperText="Write a list of comma separated IDs and press Enter"
            onKeyDown={
              ((event: any) => {
                if (event?.keyCode === 13) {
                  parseSearchTxt();
                }
              }) as any
            }
          />
        </Grid>
      )}

      {assetsToOptin.map((item) => (
        <GridCenter item xs={12} md={4} key={item.id}>
          <AssetPreview asset={item} onDelete={onDelete} />
        </GridCenter>
      ))}

      {Boolean(urlIds && assetsToOptin.length === 0) && (
        <GridCenter item xs={12} md={4} style={{ color: '#fff' }}>
          All assets are already in the wallet.
        </GridCenter>
      )}

      {assetsToOptin.length > 0 && (
        <GridCenter item xs={12} style={{ marginBottom: 10 }}>
          <Button startIcon={<AddIcon />} variant={'contained'} onClick={() => completeOptin()}>
            OPTIN
          </Button>
        </GridCenter>
      )}
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

export default OptinPage;
