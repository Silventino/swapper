import { Button, Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';
import { useHistory } from 'react-router';
import 'reflect-metadata';
import '../App.css';
import GridCenter from '../components/generic/GridCenter';

function FailPage() {
  const classes = useStyles();

  const history = useHistory();

  return (
    <Grid container spacing={4} className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.bigtxt}>😔</Typography>
        <Typography className={classes.medtxt}>Fail...</Typography>
        <Typography className={classes.smalltxt}>The swap was not completed.</Typography>
        <Typography className={classes.smalltxt}>
          You took too long to complete the swap and now it is invalid. Please, create another one.
        </Typography>

        <Button variant="contained" className={classes.btn} onClick={() => history.replace('/')}>
          NEW SWAP
        </Button>
      </GridCenter>
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      maxWidth: 500
    },
    swapGrid: {
      marginTop: 10,
      padding: 15
    },
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
      fontSize: 50,
      color: '#fff',
      textAlign: 'center'
    },
    smalltxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 20,
      color: '#fff',
      textAlign: 'center'
    },
    qr: {
      width: 300,
      height: 300,
      margin: 15,
      borderRadius: 10
    },
    btn: {
      marginTop: 20
    }
  })
);

export default FailPage;
