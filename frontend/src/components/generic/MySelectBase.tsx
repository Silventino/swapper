import { MenuItem, Select, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useEffect } from 'react';

type Props<T> = {
  label?: string;
  options: T[];
  getOptionLabel: (x: T | null) => string;
  value: T | null;
  onChange: (x: T) => void;
  style?: any;
};

function MySelectBase<T>(props: Props<T>) {
  const { options, getOptionLabel, value, onChange, label, style } = props;

  useEffect(() => {}, []);

  return (
    <Select
      label={label}
      style={style}
      value={getOptionLabel(value)}
      onChange={(event, x) => {
        const newStr = event.target.value;
        const newValue = options.find((item) => getOptionLabel(item) === newStr);
        onChange(newValue!);
      }}
      multiline
    >
      {options.map((item) => (
        <MenuItem key={getOptionLabel(item)} value={getOptionLabel(item)}>
          {getOptionLabel(item)}
        </MenuItem>
      ))}
    </Select>
  );
}

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MySelectBase;
