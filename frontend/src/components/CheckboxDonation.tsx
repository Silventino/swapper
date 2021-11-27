import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import { Checkbox, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { useState } from 'react';
import { ALGO_ASSET, FINITE_ASSET, YLDY_ASSET } from '../constants';
import { AssetInfo } from '../providers/WalletContextProvider';
import MyNumberInput from './generic/MyNumberInput';
import MySelectBase from './generic/MySelectBase';

export type DonationInfo = {
  willDonate: boolean;
  asset: AssetInfo;
  amount: number;
};

type Props = {
  donationInfo: DonationInfo;
  setDonationInfo: (x: DonationInfo) => void;
};

const CheckboxDonation: React.FC<Props> = (props) => {
  const { donationInfo, setDonationInfo } = props;
  const classes = useStyles();
  const [assets] = useState<AssetInfo[]>([ALGO_ASSET, YLDY_ASSET, FINITE_ASSET]);

  return (
    <div
      className={classes.container}
      onClick={() => setDonationInfo({ ...donationInfo, willDonate: !donationInfo.willDonate })}
    >
      <Checkbox checked={donationInfo.willDonate} onChange={() => {}} />
      <Typography className={classes.textRight}>I want to donate</Typography>

      <div onClick={(e) => e.stopPropagation()}>
        <MyNumberInput
          label={''}
          decimalScale={1}
          value={donationInfo.amount}
          onChange={(txt) => setDonationInfo({ ...donationInfo, amount: txt })}
          className={clsx(classes.input, classes.numberInput)}
        />
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <MySelectBase<AssetInfo>
          options={assets}
          getOptionLabel={(x) => (x ? x.unitname : 'None')}
          value={donationInfo.asset}
          onChange={(x) => setDonationInfo({ ...donationInfo, asset: x })}
          className={classes.input}
        />
      </div>

      <Typography className={classes.textLeft}>to Swapper</Typography>
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
    textRight: { marginRight: 5 },
    textLeft: { marginLeft: 5 }
  })
);

export default CheckboxDonation;
