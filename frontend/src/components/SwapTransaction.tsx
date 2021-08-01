import {
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import React from "react";
import "reflect-metadata";
import "../App.css";

type Props = {
  // transaction: MyTransaction;
  // setTransaction: (x: MyTransaction) => void;
};

const SwapTransaction: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.container} spacing={4}>
        <Grid item xs={12}>
          <TextField fullWidth placeholder={"Sender Address"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth placeholder={"Receiver Address"} />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth placeholder={"Asset ID"} />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth placeholder={"Quantity"} />
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
    },
  })
);

export default SwapTransaction;
