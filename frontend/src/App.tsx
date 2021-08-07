import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import 'reflect-metadata';
import './App.css';
import CreateTransactionPage from './components/CreateTransactionPage';
import RainbowDiv from './components/generic/RainbowDiv';
import Header from './components/Header';
import { HEADER_HEIGHT } from './constants';

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <Header />

      <div className={classes.appContent}>
        <CreateTransactionPage />
      </div>
    </div>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    appContent: {
      padding: 25,
      paddingTop: HEADER_HEIGHT + 25,
      display: 'flex',
      justifyContent: 'center'
    },
    swapGrid: { marginTop: 10 }
  })
);

export default App;
