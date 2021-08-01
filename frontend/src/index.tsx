import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { createGlobalStyle } from "styled-components";
import { WalletContextProvider } from "./components/WalletContextProvider";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

`;

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <MuiThemeProvider theme={darkTheme}>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
