import { makeStyles, Theme, createStyles, Button, IconButton } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { colors, HEADER_HEIGHT } from 'src/constants';
import logo from '../assets/logo.svg';

import clsx from 'clsx';
import WalletContext from './WalletContextProvider';
import MySelect from './generic/MySelect';
import MySelectBase from './generic/MySelectBase';
import { showError } from 'src/helpers/helper';
import ConnectButton from './ConnectButton';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const Header: React.FC = (props) => {
  const walletContext = useContext(WalletContext);

  const classes = useStyles();

  const logout = () => {
    walletContext.functions.logout();
  };

  return (
    <div className={clsx(classes.header)}>
      <h4 className={classes.pacifico}>PacSwap</h4>
      {/* <img src={logo} className={clsx(classes.logo, 'App-logo')} alt="logo" /> */}

      {!Boolean(walletContext.accounts.length) && <ConnectButton />}

      {Boolean(walletContext.accounts.length) && (
        <div>
          <MySelectBase
            options={walletContext.accounts.map((item) => item.address)}
            getOptionLabel={(x) => `${x?.substring(0, 5)}...${x?.substring(53)}`}
            value={walletContext.selectedAccount?.address}
            onChange={(x) => (x ? walletContext.functions.selectAccount(x) : null)}
          />
          <IconButton onClick={() => logout()}>
            <MeetingRoomIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    logo: { height: HEADER_HEIGHT - 25 },
    header: {
      width: '100vw',
      backgroundColor: colors.background,
      position: 'absolute',
      top: 0,
      left: 0,
      height: HEADER_HEIGHT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 20,
      paddingLeft: 20
      // borderBottomWidth: 0.01,
      // borderBottom: 'solid white'
    },
    title: {
      color: 'white'
    },
    pacifico: {
      fontFamily: "'Pacifico', cursive",
      color: 'white',
      fontSize: 25
    }
  })
);

export default Header;
