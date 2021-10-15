import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { colors, HEADER_HEIGHT } from 'src/constants';
import ConnectButton from './ConnectButton';
import MySelectBase from './generic/MySelectBase';
import WalletContext from './WalletContextProvider';
import icon from '../assets/icon.png';
import logo_full from '../assets/logo_full.png';

const Header: React.FC = (props) => {
  const walletContext = useContext(WalletContext);

  const classes = useStyles();

  const logout = () => {
    walletContext.functions.logout();
  };

  return (
    <div className={clsx(classes.header)}>
      <a href={'/swapper'} className={classes.title}>
        <img src={logo_full} alt="logo" className={classes.logo} />
        {/* <img src={icon} alt="logo" className={classes.logo} /> */}
      </a>

      {!Boolean(walletContext.accounts.length) && <ConnectButton />}

      {Boolean(walletContext.accounts.length) && (
        <div>
          <MySelectBase
            options={walletContext.accounts.map((item) => item.address)}
            getOptionLabel={(x) => `${x?.substring(0, 5)}...${x?.substring(53)}`}
            value={walletContext.selectedAccount?.address}
            onChange={(x) => (x ? walletContext.functions.selectAccount(x) : null)}
          />
          <IconButton onClick={() => logout()} className={classes.logoutButton}>
            <MeetingRoomIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
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
      paddingRight: 10,
      paddingLeft: 10
      // borderBottomWidth: 0.01,
      // borderBottom: 'solid white'
    },
    title: {
      display: 'flex',
      flexDirection: 'row'
    },
    logo: {
      // width: 35,
      height: 42,
      marginLeft: 5,
      marginRight: 2
    },
    pacifico: {
      fontFamily: "'Pacifico', cursive",
      color: 'white',
      fontSize: 22
    },
    roboto: {
      fontFamily: 'Roboto',
      color: 'white',
      fontSize: 25
    },
    logoutButton: {
      width: 35,
      height: 35
    }
  })
);

export default Header;
