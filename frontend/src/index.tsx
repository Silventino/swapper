// import reportWebVitals from "./reportWebVitals";
import {adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider} from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'reflect-metadata';
import App from './App';
import './App.css';
import {colors} from './constants';
import {WalletContextProvider} from './providers/WalletContextProvider';

const darkTheme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
      primary: { main: '#61dafb' },

      background: { default: colors.background }
    }
  })
);

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: { main: '#61dafb' }
//     // background: { default: colors.background }
//   }
// });

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      closeOnClick
      draggable
      pauseOnHover
    />
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <WalletContextProvider>
          <App />
        </WalletContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
