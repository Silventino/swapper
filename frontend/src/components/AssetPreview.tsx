import { Grid, IconButton, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { getAssetImage } from 'src/helpers/helper';
import '../App.css';
import GridCenter from './generic/GridCenter';
import MyInput from './generic/MyInput';
// // import RainbowDiv from './generic/RainbowDiv';
import { AssetInfo } from '../providers/WalletContextProvider';
import DeleteIcon from '@mui/icons-material/Close';

type Props = {
  asset: AssetInfo;
  onDelete?: (asset: AssetInfo) => void;
};

const AssetPreview: React.FC<Props> = (props) => {
  const { asset, onDelete } = props;
  const classes = useStyles();

  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    getAssetImage(asset).then((url) => setImageUrl(url));
  }, [asset]);

  return (
    <div className={classes.container}>
      <Grid container spacing={4}>
        {/* <GridCenter item xs={12}>
          <Title variant={'h4'}>{`Asset #${asset.id}`}</Title>
        </GridCenter> */}

        <GridCenter item xs={12}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 40, height: 40 }} />

            <img src={imageUrl} alt="" className={classes.img} />

            <div style={{ width: 40, height: 40 }}>
              {onDelete && (
                <IconButton onClick={() => onDelete(asset)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        </GridCenter>

        <Grid item xs={12}>
          <MyInput
            label={'Asset'}
            value={`${asset?.id} - ${asset?.assetname}` ?? ''}
            onChange={(asset) => {}}
            disabled
            multiline
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
      maxWidth: 400,
      borderRadius: '5px',
      padding: 20
    },
    img: {
      width: 100,
      height: 100,
      objectFit: 'contain',
      borderRadius: 7
    },
    loaderDiv: { width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  })
);

export default AssetPreview;
