import { Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';
import 'reflect-metadata';
import '../App.css';
import GridCenter from '../components/generic/GridCenter';

function MaintenancePage() {
  const classes = useStyles();

  // const copyToClipboard = () => {
  //   try {
  //     navigator.clipboard.writeText('VT7NZ62266IYHMEHWXLZXARZLA324BDTTKNJPYWXBNDO7TYMWJY27KC2XY');
  //     showNotification('Address copied to clipboard!');
  //   } catch (err) {
  //     showError(err);
  //   }
  // };

  return (
    <Grid container spacing={4} className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.bigtxt}>🛠️</Typography>
        <Typography className={classes.medtxt}>Under Maintenance.</Typography>
        <Typography className={classes.smalltxt}>
          Swapper is under maintenance,{' '}
          <a href="https://twitter.com/Silventino" target="_blank">
            follow me on Twitter for further updates.
          </a>
        </Typography>
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

export default MaintenancePage;
