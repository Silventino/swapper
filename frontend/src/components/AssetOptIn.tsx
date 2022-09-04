import { Button, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { getAssetImage, showError } from 'src/helpers/helper';
import '../App.css';
import GridCenter from './generic/GridCenter';
import MyInput from './generic/MyInput';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';
import Loader from './generic/Loader';
import WalletContext, { AssetInfo } from '../providers/WalletContextProvider';
import assetApi from '../api/assetApi';

type Props = {
  assetIndex: number;
  onOptIn: () => void;
};

const AssetOptIn: React.FC<Props> = (props) => {
  const { assetIndex, onOptIn } = props;
  const classes = useStyles();

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const walletContext = useContext(WalletContext);

  const optinAsset = async () => {
    setLoading(true);
    try {
      await walletContext.optinAssets([assetIndex]);
      onOptIn();
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getAsset = async () => {
      setLoading(true);
      try {
        let newAsset;
        newAsset = await assetApi.getAssetInfo(assetIndex);
        setSelectedAsset(newAsset ?? null);
      } catch (err) {
        showError(err);
      }
      setLoading(false);
    };

    getAsset();
  }, [assetIndex]);

  useEffect(() => {
    getAssetImage(selectedAsset).then((url) => setImageUrl(url));
  }, [selectedAsset]);

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={4}>
        <GridCenter item xs={12}>
          <Title variant={'h4'}>{`Asset #${assetIndex}`}</Title>
        </GridCenter>

        <GridCenter item xs={12}>
          <img src={imageUrl} alt="" className={classes.img} />
        </GridCenter>

        <Grid item xs={12}>
          <MyInput label={'Asset'} value={selectedAsset?.assetname ?? ''} onChange={(asset) => {}} disabled multiline />
        </Grid>

        {!loading && (
          <GridCenter item xs={12}>
            <Button variant={'contained'} onClick={optinAsset}>
              OPT-IN
            </Button>
          </GridCenter>
        )}

        {loading && (
          <GridCenter item xs={12}>
            <div className={classes.loaderDiv}>
              <Loader size={20} />
            </div>
          </GridCenter>
        )}
      </Grid>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      maxWidth: 400,
      borderRadius: '5px',
      padding: 20
    },
    img: {
      width: 200,
      height: 200,
      objectFit: 'contain',
      borderRadius: 7
    },
    loaderDiv: { width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  })
);

export default AssetOptIn;
