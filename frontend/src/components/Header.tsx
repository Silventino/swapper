import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { HEADER_HEIGHT } from "src/constants";
import logo from "../logo.svg";

import clsx from "clsx";
import WalletContext from "./WalletContextProvider";
import MySelect from "./generic/MySelect";
import MySelectBase from "./generic/MySelectBase";

const Header: React.FC = (props) => {
  const walletContext = useContext(WalletContext);

  useEffect(() => {}, []);
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <img src={logo} className={clsx(classes.logo, "App-logo")} alt="logo" />

      {!Boolean(walletContext.accounts.length) && (
        <Button
          variant={"contained"}
          onClick={() => walletContext.functions.connectMyAlgo()}
        >
          Connect
        </Button>
      )}

      {Boolean(walletContext.accounts.length) && (
        <MySelectBase
          options={walletContext.accounts.map((item) => item.address)}
          getOptionLabel={(x) => `${x?.substring(0, 5)}...${x?.substring(53)}`}
          value={walletContext.selectedAccount?.address}
          setValue={(x) =>
            x ? walletContext.functions.selectAccount(x) : null
          }
        />
      )}
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    logo: { height: HEADER_HEIGHT - 25 },
    header: {
      width: "100vw",
      backgroundColor: "#282c34",
      position: "absolute",
      top: 0,
      left: 0,
      height: HEADER_HEIGHT,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingRight: 10,
      paddingLeft: 10,
    },
  })
);

export default Header;
