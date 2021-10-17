import { IconButton, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MenuIcon from '@mui/icons-material/Menu';
import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import { colors, HEADER_HEIGHT } from 'src/constants';
import logo_full from '../assets/logo_full.png';
import ConnectButton from './ConnectButton';
import Drawer from './Drawer';
import MySelectBase from './generic/MySelectBase';
import WalletContext from './WalletContextProvider';

const Header: React.FC = (props) => {
  const walletContext = useContext(WalletContext);

  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const logout = () => {
    walletContext.functions.logout();
  };

  return (
    <div className={clsx(classes.header)}>
      <div className={classes.row}>
        <IconButton className={classes.headerButton} onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>

        <Drawer open={open} setOpen={setOpen} />

        <a href={'/swapper'} className={classes.title}>
          <img src={logo_full} alt="logo" className={classes.logo} />
          {/* <img src={icon} alt="logo" className={classes.logo} /> */}
        </a>
      </div>

      {!Boolean(walletContext.accounts.length) && <ConnectButton />}

      {Boolean(walletContext.accounts.length) && (
        <div>
          <MySelectBase
            options={walletContext.accounts.map((item) => item.address)}
            getOptionLabel={(x) => `${x?.substring(0, 5)}...${x?.substring(53)}`}
            value={walletContext.selectedAccount?.address}
            onChange={(x) => (x ? walletContext.functions.selectAccount(x) : null)}
            style={{ paddingTop: 5, paddingBottom: 5 }}
          />
          <IconButton onClick={() => logout()} className={classes.headerButton} size="medium">
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
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    title: {
      display: 'flex',
      flexDirection: 'row'
    },
    logo: {
      // width: 35,
      height: 35,
      marginLeft: 5,
      marginRight: 2,
      objectFit: 'contain'
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
    headerButton: {
      width: 35,
      height: 35
    },
    drawer: {
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    drawerItem: {
      paddingRight: 35
    }
  })
);

export default Header;
