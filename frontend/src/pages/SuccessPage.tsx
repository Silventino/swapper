import { Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import 'reflect-metadata';
import { showError, showNotification } from 'src/helpers/helper';
import '../App.css';
import qr from '../assets/qr.jpeg';
import GridCenter from '../components/generic/GridCenter';

function SuccessPage() {
  const classes = useStyles();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText('VT7NZ62266IYHMEHWXLZXARZLA324BDTTKNJPYWXBNDO7TYMWJY27KC2XY');
      showNotification('Address copied to clipboard!');
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Grid container spacing={4} className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.bigtxt}>🎉</Typography>
        <Typography className={classes.medtxt}>Success!</Typography>
        <Typography className={classes.smalltxt}>The swap was completed.</Typography>
        <Typography className={classes.smalltxt}>
          If this app helped you, please consider donating any amount to:
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

export default SuccessPage;
