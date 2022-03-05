import { Button, Grid, Theme, Typography } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import 'reflect-metadata';
import swapApi from 'src/api/swapApi';
import { colors } from 'src/constants';
import Swap from 'src/types/Swap';

function HistoryPage() {
  const classes = useStyles();
  const history = useHistory();

  const [swaps, setSwaps] = useState<Swap[]>([]);
  const rowsPerPage = 10;
  const [page, setPage] = useState(0);

  const getMySwaps = async () => {
    try {
      const data = await swapApi.getMySwaps({ skip: rowsPerPage * page, take: rowsPerPage });
      setSwaps(data);
      console.log('data', data);
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    getMySwaps();
  }, []);

  return (
    <Grid container spacing={4} className={classes.container}>
      <Grid item xs={12} style={{ padding: 0 }}>
        <Typography className={classes.medtxt}>My Swaps</Typography>
      </Grid>

      {/*
      <Grid item xs={12}>
        <Button variant={'contained'} onClick={getMySwaps} id={'btn-accept'}>
          TEST
        </Button>
      </Grid>
      */}

      {swaps.map((swap) => (
        <Grid
          item
          xs={12}
          style={{
            padding: 0,
            border: '2px solid white',
            marginBottom: 10,
            borderRadius: 7,
            backgroundColor: '#c3c3c3'
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <p>{swap.txId}</p>
            </Grid>
            <Grid item xs={12}>
              <p>{swap.txId}</p>
            </Grid>
          </Grid>
        </Grid>
      ))}

      {/* <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">With</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.txId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{row.txId}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.withAddr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
    </Grid>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      padding: '10px 30px 30px 30px',
      borderRadius: '5px',
      maxWidth: 'min(100vw, 950px)'
    },
    swapGrid: {
      marginTop: 10,
      padding: 15
    },
    bigtxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 100,
      color: '#fff'
    },
    medtxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 50,
      color: '#fff'
    },
    smalltxt: {
      marginLeft: 10,
      marginRight: 10,
      fontSize: 20,
      color: '#fff'
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

export default HistoryPage;
