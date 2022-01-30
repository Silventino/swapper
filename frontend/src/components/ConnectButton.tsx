import {Button} from '@material-ui/core';
import React, {useContext} from 'react';
import {showError} from 'src/helpers/helper';
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


// const useStyles = makeStyles<Theme>((theme) =>
//   createStyles({})
// );

export default ConnectButton;
