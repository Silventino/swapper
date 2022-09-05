import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { getAssetImage } from 'src/helpers/helper';
import { Checkbox } from '@mui/material';
import { AssetInfo } from '../../providers/WalletContextProvider';
import ImgWithLoader from 'src/components/ImgWithLoader';

type Props = {
  asset: AssetInfo;
  checked: boolean;
  onClick: () => void;
};

const AssetOptoutPreview: React.FC<Props> = (props) => {
  const { asset, onClick, checked } = props;
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    getAssetImage(asset).then((url) => setImageUrl(url));
  }, [asset]);

  return (
    <div className={classes.container} onClick={onClick}>
      <Checkbox checked={checked} />

      <ImgWithLoader src={imageUrl} alt="" className={classes.img} />

      <p className={classes.txt}>{`${asset?.id} - ${asset?.assetname}`}</p>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      maxWidth: 400,
      borderRadius: '5px',
      padding: 20,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer'
    },
    img: {
      width: 50,
      height: 50,
      objectFit: 'contain',
      borderRadius: 7,
      marginRight: 8
    },
    txt: {
      color: '#fff'
    }
  })
);

export default AssetOptoutPreview;
