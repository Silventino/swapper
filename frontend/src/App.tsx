import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'reflect-metadata';
import './App.css';
import Header from './components/Header';
import ModalConnect from './components/ModalConnect';
import ModalLoading from './components/ModalLoading';
import WalletContext from './components/WalletContextProvider';
import { HEADER_HEIGHT } from './constants';
import CreateSwapPage from './pages/CreateSwapPage';
import SignTransactionPage from './pages/SignTransactionPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  const classes = useStyles();

  const walletContext = useContext(WalletContext);

  return (
    <div className="App">
      <ModalConnect />
      <ModalLoading loading={walletContext.loadingAccount} />

      <Header />

      <div className={classes.appContent}>
        <Router>
          <Switch>
            <Route path="/saturnswap/tx/:id">
              <SignTransactionPage />
            </Route>
            <Route path="/saturnswap/success">
              <SuccessPage />
            </Route>
            <Route path="/saturnswap/">
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
      marginTop: HEADER_HEIGHT + 40,
      display: 'flex',
      justifyContent: 'center'
    },
    swapGrid: { marginTop: 10 }
  })
);

export default App;
