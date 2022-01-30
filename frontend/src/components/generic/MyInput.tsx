import {FormControl, InputAdornment, InputLabel, OutlinedInput} from '@material-ui/core';
import React, {ReactNode} from 'react';

type Props = {
  label: string;
  fullWidth?: boolean;
  endAdornment?: ReactNode;
  value: string;
  onChange: (x: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  className?: string;
  maxLength?: number;
  helperText?: string;

  inputId?: string;
};

const MyInput: React.FC<Props> = (props) => {
  const { label, fullWidth, endAdornment, value, onChange, className, inputId, ...rest } = props;

  return (
    <FormControl fullWidth className={className}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        id={inputId}
        fullWidth={fullWidth}
        label={label}
        endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      />
    </FormControl>
  );
};

// type StyleProps = {};
// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyInput;
