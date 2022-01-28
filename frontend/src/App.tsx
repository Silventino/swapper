import {Theme} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, {useContext} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import 'reflect-metadata';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ModalConnect from './components/ModalConnect';
import ModalLoading from './components/ModalLoading';
import WalletContext from './providers/WalletContextProvider';
import {HEADER_HEIGHT} from './constants';
import CreateSwapPage_OLD from './pages/CreateSwapPage_OLD';
import SignTransactionPage from './pages/SignTransactionPage';
import SuccessPage from './pages/SuccessPage';
import FailPage from './pages/FailPage';
import OptoutPage from './pages/OptoutPage';
import CreateSwapPage from './pages/CreateSwapPage';
import DonatePage from './pages/DonatePage';

function App() {
  const classes = useStyles();

  const walletContext = useContext(WalletContext);

  return (
    <Router>
      <div className="App">
        <ModalConnect/>
        <ModalLoading loading={walletContext.loadingAccount}/>

        <Header/>

        {/* <MyParticles /> */}
        <div className={classes.appContent}>
          <div style={{zIndex: 1}}>
            <Switch>
              <Route path="/tx/:id">
                <SignTransactionPage/>
              </Route>
              <Route path="/donate">
                <DonatePage/>
              </Route>
              <Route path="/success">
                <SuccessPage/>
              </Route>
              <Route path="/fail">
                <FailPage/>
              </Route>
              <Route path="/optout">
                <OptoutPage/>
              </Route>
              <Route path="/old">
                <CreateSwapPage_OLD/>
              </Route>
              <Route path="/">
                <CreateSwapPage/>
              </Route>
              <Route path="/*">
                <Redirect to={'/'}/>
              </Route>
            </Switch>
          </div>
          <Footer/>
        </div>

      </div>
    </Router>
  );
}

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    appContent: {
      paddingTop: HEADER_HEIGHT + 50,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh'
      // flex: 1,
      // height: '100%'
    },
    swapGrid: {marginTop: 10}
  })
);

export default App;
