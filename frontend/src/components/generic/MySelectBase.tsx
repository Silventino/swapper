import {MenuItem, Select} from '@material-ui/core';
import React, {useEffect} from 'react';

type Props<T> = {
  label?: string;
  options: T[];
  getOptionLabel: (x: T | null) => string;
  value: T | null;
  onChange: (x: T) => void;
  style?: any;

  className?: string;
  inputId?: string;
};

function MySelectBase<T>(props: Props<T>) {
  const { options, getOptionLabel, value, onChange, label, style, className, inputId } = props;

  useEffect(() => {}, []);

  return (
    <Select
      id={inputId}
      label={label}
      style={style}
      value={getOptionLabel(value)}
      onChange={(event, x) => {
        const newStr = event.target.value;
        const newValue = options.find((item) => getOptionLabel(item) === newStr);
        onChange(newValue!);
      }}
      multiline
      className={className}
    >
      {options.map((item) => (
        <MenuItem key={getOptionLabel(item)} value={getOptionLabel(item)}>
          {getOptionLabel(item)}
        </MenuItem>
      ))}
    </Select>
  );
}

// type StyleProps = {};
// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MySelectBase;
