import { Button, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useContext } from 'react';
import MyModal from './generic/MyModal';
import WalletContext from '../providers/WalletContextProvider';
import { HEADER_HEIGHT } from '../constants';
import DivCenter from './generic/DivCenter';
import TermsOfService from './TermsOfService';
import { red } from '@material-ui/core/colors';

type Props = {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
};

const ModalTermsOfService: React.FC<Props> = (props) => {
  const { open, onClose, onAccept } = props;

  const classes = useStyles();

  return (
    <MyModal open={open} onClose={onClose}>
      <Typography className={classes.medtxt}>Terms of Service</Typography>
      <TermsOfService />

      <DivCenter className={classes.divButtons}>
        <Button variant={'contained'} style={{ backgroundColor: red[500], color: '#fff' }} onClick={onClose}>
          DENY
        </Button>
        <Button variant={'contained'} onClick={onAccept} id={"btn-accept"}>
          ACCEPT AND CONTINUE
        </Button>
      </DivCenter>
    </MyModal>
  );
};

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
    },
    divButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
  })
);

export default ModalTermsOfService;
