import { Theme, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import React, { useEffect } from 'react';

import MySelectBase from './MySelectBase';

type Props<T> = {
  label: string;
  options: T[];
  getOptionLabel: (x: T | null) => string;
  value: T | null;
  onChange: (x: T) => void;

  fullWidth?: boolean;
  inputId?: string;
  className?: string;
};

function MySelect<T>(props: Props<T>) {
  const { label, options, getOptionLabel, value, onChange, fullWidth, inputId, className } = props;

  useEffect(() => {}, []);

  return (
    <FormControl
      // variant="filled"
      fullWidth={fullWidth === false ? false : true}
      className={className}
    >
      <InputLabel>{label}</InputLabel>
      <MySelectBase label={label} options={options} getOptionLabel={getOptionLabel} value={value} onChange={onChange} inputId={inputId} />
    </FormControl>
  );
}

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MySelect;
