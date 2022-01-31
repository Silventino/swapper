import {Theme} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';
import {Checkbox, FormControlLabel} from "@mui/material";

type Props = {
  label: string;
  value: boolean;
  onChange: (x: boolean) => void;
};

const MyCheckbox: React.FC<Props> = (props) => {
  const { label, value, onChange, ...rest } = props;

  return (
    <FormControlLabel
      control={
        <Checkbox checked={value} onChange={() => onChange(!value)}  />
      }
      label={label}
    />
  );
};

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyCheckbox;
