import { Button, Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import WalletContext from 'src/providers/WalletContextProvider';
import '../App.css';
import ConnectedWalletSelect from './generic/ConnectedWalletSelect';
import GridCenter from './generic/GridCenter';
import MyInput from './generic/MyInput';
// // import RainbowDiv from './generic/RainbowDiv';
import Title from './generic/Title';

type Props = {
  addressA: string;
  setAddressA: (x: string) => void;
  addressB: string;
  setAddressB: (x: string) => void;
};

const AddressForm: React.FC<Props> = (props) => {
  const { addressA, setAddressA, addressB, setAddressB } = props;
  const walletContext = useContext(WalletContext);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={4}>
        <GridCenter item xs={12}>
          <Title className={classes.title} variant={'h4'}>{`Who is swapping?`}</Title>
        </GridCenter>

        <Grid item xs={12} md={6}>
          <ConnectedWalletSelect label={'You'} value={addressA} onChange={(txt) => setAddressA(txt)} />

          {addressA && (
            <div className={classes.buttonDiv}>
              <Button variant={'contained'} onClick={() => {}} disabled>
                ASSETS LOADED
              </Button>
            </div>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <MyInput
            className={classes.input}
            label={'Other'}
            fullWidth
            value={addressB}
            onChange={(txt) => setAddressB(txt)}
            maxLength={58}
          />

          {addressB && addressB.length === 58 && walletContext.secondaryAssets.length === 0 && (
            <div className={classes.buttonDiv}>
              <Button variant={'contained'} onClick={() => {}}>
                LOAD ASSETS*
              </Button>
              <Typography color={'#fff'} fontSize={12}>
                *Optional
              </Typography>
            </div>
          )}

          {addressB && addressB.length === 58 && walletContext.secondaryAssets.length > 0 && (
            <div className={classes.buttonDiv}>
              <Button variant={'contained'} onClick={() => {}} disabled>
                ASSETS LOADED
              </Button>
            </div>
          )}
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
    buttonDiv: {
      paddingTop: 15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    input: {
      // margin: 10
    },
    title: {}
  })
);

export default AddressForm;
