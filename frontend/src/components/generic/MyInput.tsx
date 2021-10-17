import { FormControl, Input, InputAdornment, InputLabel, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { ReactNode } from 'react';

type Props = {
  label: string;
  fullWidth?: boolean;
  endAdornment?: ReactNode;
  value: string;
  onChange: (x: string) => void;
  disabled?: boolean;
  multiline?: boolean;
};

const MyInput: React.FC<Props> = (props) => {
  const { label, fullWidth, endAdornment, value, onChange, ...rest } = props;
  // useEffect(() => {}, []);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Input
        fullWidth={fullWidth}
        endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      />
    </FormControl>
  );
};

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyInput;
