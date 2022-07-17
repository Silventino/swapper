import { Autocomplete, Button, createFilterOptions, Grid, TextField, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { getAssetLabel, showError, showNotification } from 'src/helpers/helper';
import WalletContext, { AssetInfo } from 'src/providers/WalletContextProvider';
import '../../App.css';
import GridCenter from '../../components/generic/GridCenter';
import AssetPreview from 'src/components/AssetPreview';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from 'src/components/generic/Loader';

function OptoutPage() {
  const classes = useStyles();
  const walletContext = useContext(WalletContext);

  const [selectedAsset, setSelectedAsset] = useState<null | AssetInfo>(null);
  const [assetsToOptout, setAssetsToOptout] = useState<AssetInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');

  const filterOptions = createFilterOptions({
    limit: 40
  });

  const addSelectedAssetToOptout = () => {
    if (selectedAsset) {
      const index = assetsToOptout.findIndex((item) => item.id === selectedAsset.id);
      if (index === -1) {
        setAssetsToOptout([...assetsToOptout, selectedAsset]);
      }
      setSelectedAsset(null);
    }
  };

  const parseSearchTxt = () => {
    try {
      let newAssets: AssetInfo[] = [];
      const cleaning = searchTxt.split(',').map((item) => item.replace(/\D/g, ''));
      const ids = [...new Set(cleaning)];

      for (let i = 0; i < ids.length; i++) {
        let assetId = parseInt(ids[i]);
        if (assetId && !isNaN(assetId)) {
          const asset = walletContext.assets.find((item) => item.id === assetId);
          if (asset) {
            newAssets.push(asset);
          }
        }
      }

      if (newAssets.length) {
        newAssets = newAssets.filter((item) => assetsToOptout.findIndex((item2) => item.id === item2.id) === -1);
        setAssetsToOptout([...assetsToOptout, ...newAssets]);
      }
    } catch {}

    setSearchTxt('');
  };

  useEffect(() => {
    addSelectedAssetToOptout();
  }, [selectedAsset]);

  const completeOptout = async () => {
    try {
      setLoading(true);
      await walletContext.optoutAssets(assetsToOptout);
      setLoading(false);
      showNotification('Opt-out transaction completed.');
      setAssetsToOptout([]);
      setSearchTxt('');
    } catch (err) {
      showError(err);
      setLoading(false);
    }
  };

  const onDelete = (asset: AssetInfo) => {
    const newAssets = assetsToOptout.filter((item) => item.id !== asset.id);
    setAssetsToOptout(newAssets);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.medtxt}>Asset Opt-Out</Typography>
      </GridCenter>

      <Grid item xs={12} style={{ marginBottom: 5 }}>
        <Autocomplete
          disablePortal
          options={walletContext.assets}
          getOptionLabel={getAssetLabel}
          value={selectedAsset}
          onChange={(e, asset: AssetInfo | null) => setSelectedAsset(asset)}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                onChange={(e) => {
                  let value = e.target.value;
                  setSearchTxt(value);
                }}
                label="Asset"
                helperText="Start typing to filter assets or write a list of comma separated IDs and press Enter"
                // disabled={loading}
                onKeyDown={
                  ((event: any) => {
                    if (event?.keyCode === 13) {
                      parseSearchTxt();
                    }
                  }) as any
                }
              />
            );
          }}
          filterOptions={filterOptions as any}
          autoSelect
        />
      </Grid>

      {assetsToOptout.map((item) => (
        <GridCenter item xs={12} md={4} key={item.id}>
          <AssetPreview asset={item} onDelete={onDelete} />
        </GridCenter>
      ))}

      {assetsToOptout.length > 0 && (
        <GridCenter item xs={12} style={{ marginBottom: 10 }}>
          <Button startIcon={<DeleteIcon />} variant={'contained'} onClick={() => completeOptout()}>
            OPTOUT
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

export default OptoutPage;
