import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';
import 'reflect-metadata';
import './App.css';
import CreateSwapPage from './pages/CreateSwapPage';
import RainbowDiv from './components/generic/RainbowDiv';
import Header from './components/Header';
import { HEADER_HEIGHT } from './constants';
import SignTransactionPage from './pages/SignTransactionPage';

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <Header />

      <div className={classes.appContent}>
        <Router>
          <Switch>
            <Route path="/t/:id">
              <SignTransactionPage />
            </Route>
            <Route path="/">
              <CreateSwapPage />
            </Route>
          </Switch>
        </Router>
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
