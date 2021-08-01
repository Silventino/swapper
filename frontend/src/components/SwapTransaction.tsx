import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import "reflect-metadata";
import "../App.css";
import GridCenter from "./generic/GridCenter";
import MyAddressInput from "./generic/MyAddressInput";
import MyNumberInput from "./generic/MyNumberInput";
import MySelect from "./generic/MySelect";
import Title from "./generic/Title";
import WalletContext from "./WalletContextProvider";

type Props = {
  index: number;
  // transaction: MyTransaction;
  // setTransaction: (x: MyTransaction) => void;
};

const SwapTransaction: React.FC<Props> = (props) => {
  const { index } = props;
  const classes = useStyles();
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [asset, setAsset] = useState<any>(null);
  const [quantity, setQuantity] = useState(0);

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
          <MyAddressInput
            label={"Sender Address"}
            value={sender}
            onChange={(txt) => setSender(txt)}
          />
        </Grid>
        <Grid item xs={12}>
          <MyAddressInput
            label={"Receiver Address"}
            value={receiver}
            onChange={(txt) => setReceiver(txt)}
          />
        </Grid>

        <Grid item xs={12}>
          <MySelect
            label={"Asset"}
            options={walletContext.selectedAccount.assets}
            getOptionLabel={(item) => (item ? item["asset-id"].toString() : "")}
            value={asset}
            setValue={(x) => setAsset(x)}
          />
        </Grid>

        <Grid item xs={12}>
          <MyNumberInput
            label={"Quantity"}
            fullWidth
            value={quantity}
            onChange={(num) => setQuantity(num)}
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
