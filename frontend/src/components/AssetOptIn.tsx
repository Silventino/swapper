import { Button, Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import clsx from 'clsx';
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
import WalletContext, { AssetInfo } from './WalletContextProvider';

type Props = {
  assetIndex: number;
  onOptIn: () => void;
};

const AssetOptIn: React.FC<Props> = (props) => {
  const { assetIndex, onOptIn } = props;
  const classes = useStyles();

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const walletContext = useContext(WalletContext);

  const getAsset = async () => {
    setLoading(true);
    try {
      let newAsset;
      newAsset = await walletContext.functions.getAssetInfo(assetIndex);
      setSelectedAsset(newAsset ?? null);
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  const optinAsset = async () => {
    setLoading(true);
    try {
      if (!walletContext.selectedAccount) {
        return;
      }
      await walletContext.functions.optinAsset(assetIndex);
      onOptIn();
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAsset();
  }, [assetIndex]);

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <Grid container className={clsx(classes.container, 'rainbow-box')} spacing={4}>
      <GridCenter item xs={12}>
        <Title variant={'h4'}>{`Asset #${assetIndex}`}</Title>
      </GridCenter>

      <GridCenter item xs={12}>
        <img src={getAssetImage(selectedAsset)} alt="" className={classes.img} />
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
    },
    loaderDiv: { width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  })
);

export default AssetOptIn;
