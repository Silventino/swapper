import {Theme, Typography} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';
import DivCenter from './generic/DivCenter';
import Loader from './generic/Loader';
import MyModal from './generic/MyModal';

type Props = {
  loading: boolean;
};

function ModalLoading(props: Props) {
  const { loading } = props;
  const classes = useStyles();

  return (
    <MyModal open={loading} onClose={() => {}} hideClose>
      <DivCenter className={classes.divButtons}>
        <Typography className={classes.smalltxt}>Loading Assets Info...</Typography>
        <Loader />
      </DivCenter>
    </MyModal>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    divButtons: {
      minWidth: 'min(300px, 100vw)',
      minHeight: 'min(100px, 100vh)'
    },
    smalltxt: {
      marginBottom: 15
    }
  })
);

export default ModalLoading;
