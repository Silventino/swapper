import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { HEADER_HEIGHT } from '../constants';

function TermsOfService() {
  const classes = useStyles();

  return (
    <Typography className={classes.smalltxt}>
      Here's how to make a swap:
      <br />
      1) Person A creates a atomic swap
      {/* 1) Person A creates a atomic swap paying 0.1 ALGO to help maintain this website */}
      <br />
      2) Person A sign the first transaction
      <br />
      3) Person A send the link to the person B
      <br />
      4) Person B signs the second transaction
      <br />
      5) Both transactions will be safely sent at the same time to the blockchain
      <br />
      <br />
      By using this website, you agree to only buy or sell artwork and gaming NFTs on this website, and never buy or
      sell investments or securities on this website. Listings are the responsibility of the seller. Due diligence is
      the responsibility of the buyer - check the ASA ID. And of course, all swaps are final, since your Algorand
      transactions are immutable.
      <br />
      <br />
      ONLY click in the button below and use the app if you agree with all the statements above.
    </Typography>
  );
}

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
    }
  })
);

export default TermsOfService;
