import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import ConnectButton from './ConnectButton';
import MyModal from './generic/MyModal';
import WalletContext from './WalletContextProvider';
import { HEADER_HEIGHT } from '../constants';
import DivCenter from './generic/DivCenter';
import TermsOfService from './TermsOfService';

function ModalConnect() {
  const classes = useStyles();

  const walletContext = useContext(WalletContext);

  return (
    <MyModal open={!Boolean(walletContext.accounts.length)} onClose={() => {}} hideClose>
      <Typography className={classes.medtxt}>Welcome to SaturnSwap!</Typography>
      <Typography className={classes.smalltxt}></Typography>

      <TermsOfService />

      <DivCenter>
        <ConnectButton title={'Accept and Connect'} />
      </DivCenter>
    </MyModal>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    appContent: {
      marginTop: HEADER_HEIGHT + 40,
      display: 'flex',
      justifyContent: 'center'
    },
    swapGrid: { marginTop: 10 },
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
      fontSize: 30,
      color: '#fff',
      textAlign: 'center'
    },
    smalltxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 16,
      color: '#fff',
      marginBottom: 15
      // textAlign: 'center'
    }
  })
);

export default ModalConnect;
