import { createStyles, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React, { useEffect } from 'react';

type Props<T> = {
  options: T[];
  getOptionLabel: (x: T | null) => string;
  value: T | null;
  onChange: (x: T) => void;
};

function MySelectBase<T>(props: Props<T>) {
  const { options, getOptionLabel, value, onChange } = props;

  useEffect(() => {}, []);

  return (
    <Select
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
