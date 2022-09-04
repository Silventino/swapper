import { Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import 'reflect-metadata';
import { colors } from 'src/constants';
import '../../App.css';
import GridCenter from '../../components/generic/GridCenter';

function OptoutPage() {
  const classes = useStyles();
  // const walletContext = useContext(WalletContext);

  return (
    <Grid container className={classes.container}>
      <GridCenter key={`transaction${0}`} item xs={12} className={classes.swapGrid}>
        <Typography className={classes.medtxt}>Gallery</Typography>
      </GridCenter>
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      padding: '0px 20px 20px 20px',
      borderRadius: '5px',
      // paddingTop: 20,
      // maxWidth: '100vw',
      maxWidth: 700
    },
    swapGrid: {
      marginTop: 10
      // padding: 15
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
      marginBottom: 20,
      fontSize: 30,
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

export default OptoutPage;
