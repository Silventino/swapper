import { Button, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext } from 'react';
import { colors, HEADER_HEIGHT } from 'src/constants';
import { showError } from 'src/helpers/helper';
import WalletContext from '../providers/WalletContextProvider';

type Props = {
  title?: string;
};

const ConnectButton: React.FC<Props> = (props) => {
  const walletContext = useContext(WalletContext);

  const connect = async () => {
    try {
      await walletContext.functions.connectMyAlgo();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Button variant={'contained'} onClick={() => connect()}>
      {props.title ?? 'Connect'}
    </Button>
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
      paddingRight: 10,
      paddingLeft: 10
      // borderBottomWidth: 0.01,
      // borderBottom: 'solid white'
    },
    title: {
      color: 'white'
    }
  })
);

export default ConnectButton;
