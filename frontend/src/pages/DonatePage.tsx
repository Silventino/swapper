import { Button, Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';
import 'reflect-metadata';
import { DONATION_ADDRESS } from 'src/constants';
import { showError, showNotification } from 'src/helpers/helper';
import '../App.css';
import qr from '../assets/qr.jpeg';
import GridCenter from '../components/generic/GridCenter';

function DonatePage() {
  const classes = useStyles();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(DONATION_ADDRESS);
      showNotification('Address copied to clipboard!');
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Grid container spacing={4} className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.bigtxt}>❤️</Typography>
        <Typography className={classes.medtxt}>Buy me a coffee</Typography>
        <Typography className={classes.smalltxt}>
          If you like the app, consider donating any amount of ALGO, YLDY or Finite to:
        </Typography>

        <img src={qr} className={classes.qr} alt={'qr-code'} />

        <Button variant="contained" onClick={copyToClipboard}>
          COPY ADDRESS
        </Button>
      </GridCenter>
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      maxWidth: 400
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
    }
  })
);

export default DonatePage;
