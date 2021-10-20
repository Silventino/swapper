import { Grid, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import '../App.css';
import ConnectedWalletSelect from './generic/ConnectedWalletSelect';
import GridCenter from './generic/GridCenter';
import MyInput from './generic/MyInput';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';
import { AssetInfo } from './WalletContextProvider';

type Props = {
  address1: string;
  setAddress1: (x: string) => void;
  address2: string;
  setAddress2: (x: string) => void;
};

const AddressForm: React.FC<Props> = (props) => {
  const { address1, setAddress1, address2, setAddress2 } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={4}>
        <GridCenter item xs={12}>
          <Title className={classes.title} variant={'h4'}>{`Who is swapping?`}</Title>
        </GridCenter>

        <Grid item xs={12} md={6}>
          <ConnectedWalletSelect label={'You'} value={address1} onChange={(txt) => setAddress1(txt)} />
        </Grid>

        <Grid item xs={12} md={6}>
          <MyInput
            className={classes.input}
            label={'Other'}
            fullWidth
            value={address2}
            onChange={(txt) => setAddress2(txt)}
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
      padding: '0px 20px 20px 20px',
      borderRadius: '5px'
    },
    img: {
      width: 200,
      height: 200,
      objectFit: 'contain',
      borderRadius: 7
    },
    input: {
      // margin: 10
    },
    title: {}
  })
);

export default AddressForm;
