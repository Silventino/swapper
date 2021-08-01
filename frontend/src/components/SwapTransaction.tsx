import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import "reflect-metadata";
import "../App.css";
import GridCenter from "./generic/GridCenter";
import MyAddressInput from "./generic/MyAddressInput";
import MyNumberInput from "./generic/MyNumberInput";
import MySelect from "./generic/MySelect";
import Title from "./generic/Title";
import WalletContext, {
  AssetInfo,
  SimpleTransaction,
} from "./WalletContextProvider";

type Props = {
  index: number;
  transaction: SimpleTransaction;
  setTransaction: (x: SimpleTransaction) => void;
  forceSenderLogged?: boolean;
  forceReceiverLogged?: boolean;
};

const SwapTransaction: React.FC<Props> = (props) => {
  const {
    index,
    transaction,
    setTransaction,
    forceSenderLogged,
    forceReceiverLogged,
  } = props;
  const classes = useStyles();

  const [disabled, setDisabled] = useState(false);

  const walletContext = useContext(WalletContext);

  if (!walletContext.selectedAccount) {
    return null;
  }

  return (
    <div>
      <Grid container className={classes.container} spacing={4}>
        <GridCenter item xs={12}>
          <Title variant={"h4"}>Transaction #{index + 1}</Title>
        </GridCenter>

        <Grid item xs={12}>
          {forceSenderLogged ? (
            <MySelect
              label={"Sender Address"}
              options={walletContext.accounts.map((item) => item.address)}
              getOptionLabel={(item) => (item ? `${item}` : "")}
              value={transaction.from}
              setValue={(txt) => setTransaction({ ...transaction, from: txt })}
            />
          ) : (
            <MyAddressInput
              label={"Sender Address"}
              value={transaction.from}
              onChange={(txt) => setTransaction({ ...transaction, from: txt })}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {forceReceiverLogged ? (
            <MySelect
              label={"Receiver Address"}
              options={walletContext.accounts.map((item) => item.address)}
              getOptionLabel={(item) => (item ? `${item}` : "")}
              value={transaction.to}
              setValue={(txt) => setTransaction({ ...transaction, to: txt })}
            />
          ) : (
            <MyAddressInput
              label={"Receiver Address"}
              value={transaction.to}
              onChange={(txt) => setTransaction({ ...transaction, to: txt })}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <MySelect<AssetInfo>
            label={"Asset"}
            options={walletContext.assets}
            getOptionLabel={(item) =>
              item ? `${item.assetname} (ID ${item.id})` : ""
            }
            value={transaction.asset}
            setValue={(txt) => setTransaction({ ...transaction, asset: txt })}
          />
        </Grid>

        <Grid item xs={12}>
          <MyNumberInput
            label={"Amount"}
            fullWidth
            decimalScale={transaction.asset ? transaction.asset.decimals : 0}
            value={transaction.amount}
            onChange={(txt) => setTransaction({ ...transaction, amount: txt })}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: "#282c34",
      // width: "300px",
      // minHeight: "400px",
      maxWidth: 400,
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      // marginTop: 50,
    },
  })
);

export default SwapTransaction;
