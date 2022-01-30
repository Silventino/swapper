import {Theme, Typography} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, {useContext} from 'react';
import ConnectButton from './ConnectButton';
import MyModal from './generic/MyModal';
import WalletContext from '../providers/WalletContextProvider';
import {HEADER_HEIGHT} from '../constants';
import DivCenter from './generic/DivCenter';
import TermsOfService from './TermsOfService';

function ModalConnect() {
  const classes = useStyles();

  const walletContext = useContext(WalletContext);

  return (
    <MyModal open={!Boolean(walletContext.accounts.length)} onClose={() => {
    }} hideClose>
      <Typography className={classes.medtxt}>Welcome to Swapper!</Typography>
      <br/>
      Here's how to make a swap:
      <br/>
      1) Person A creates the swap
      <br/>
      2) Person A signs the first transaction
      <br/>
      3) Person A sends the link to the person B
      <br/>
      4) Person B signs the second transaction
      <br/>
      5) Both transactions will be safely sent at the same time to the blockchain
      <br/>
      <br/>
      To make this tool safe we are using the atomic transfer feature of Algorand, you can read more about it{' '}
      <a href="https://developer.algorand.org/docs/get-details/atomic_transfers/" target="_blank" rel="noreferrer">
        clicking here
      </a>
      .
      <br/>
      <TermsOfService/>
      <DivCenter>
        <ConnectButton title={'Accept and Connect'}/>
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
    swapGrid: {marginTop: 10},
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
