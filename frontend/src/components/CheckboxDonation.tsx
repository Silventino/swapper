import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, {useContext, useState} from 'react';
import { useHistory } from 'react-router';
import {Checkbox, Typography} from "@mui/material";
import MySelectBase from "./generic/MySelectBase";
import WalletContext, {AssetInfo} from "../providers/WalletContextProvider";
import {ALGO_ASSET, FINITE_ASSET, YLDY_ASSET} from "../constants";
import MyNumberInput from "./generic/MyNumberInput";
import clsx from "clsx";

type Props = {
};

const CheckboxDonation: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [assets] = useState<AssetInfo[]>([
    ALGO_ASSET,
    YLDY_ASSET,
    FINITE_ASSET
  ])

  return (
    <div className={classes.container} onClick={()=>console.log("OKOKOK")}>
      <Checkbox checked={true} onChange={() => {}}  />
      <Typography className={classes.textRight}>
        I want to donate
      </Typography>

      <div onClick={(e)=> e.stopPropagation()}>
        <MyNumberInput
          label={''}
          decimalScale={1}
          value={0.5}
          onChange={(txt) => {}}
          className={clsx(classes.input, classes.numberInput)}
        />
      </div>

      <div onClick={(e)=> e.stopPropagation()}>
        <MySelectBase<AssetInfo>
          options={assets}
          getOptionLabel={(x) => x? x.unitname : 'None' }
          value={ALGO_ASSET}
          onChange={(x) => {}}
          className={classes.input}
        />
      </div>

      <Typography className={classes.textLeft}>
        to Swapper
      </Typography>

    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      color: '#fff',
      alignItems: 'center'
    },
    input: { paddingTop: 5, paddingBottom: 5 },
    numberInput: { width: 55, textAlign: 'center' },
    textRight: {marginRight: 5},
    textLeft: {marginLeft: 5}
  })
);

export default CheckboxDonation;
