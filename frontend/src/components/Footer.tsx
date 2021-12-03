import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import { Button, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { colors, HEADER_HEIGHT } from 'src/constants';
import WalletContext from '../providers/WalletContextProvider';

const Footer: React.FC = (props) => {
  const walletContext = useContext(WalletContext);

  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={clsx(classes.footer)}>
      <Typography className={classes.smalltxt}>Made with ❤️ by <a href='https://twitter.com/Silventino' target='_blank' >@silventino</a></Typography>
      <Button
        style={{marginBottom: 15}}
        onClick={()=> history.push('/donate')}
      >
        ♥ Buy me a coffee ♥
      </Button>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    footer: {
      zIndex: 2,
      paddingTop: 10,
      marginTop: 20,
      width: '100vw',
      backgroundColor: colors.backgroundDark,
      display: 'flex',
      flexDirection: 'column',

      alignItems: 'center',
      justifyContent: 'center',
      // alignSelf: 'flex-end',
      // justifySelf: 'flex-end'
    },
    smalltxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 20,
      color: '#fff',
      textAlign: 'center'
    },

  })
);

export default Footer;
