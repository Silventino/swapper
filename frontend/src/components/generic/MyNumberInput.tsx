import { TextField } from '@material-ui/core';
import React from 'react';
import NumberFormat from 'react-number-format';

type Props = {
  label: string;
  fullWidth?: boolean;
  value: number;
  onChange: (x: number) => void;
  decimalScale?: number;
  className?: string;

  id?: string;
  max?: number;
  onBlur?: () => void;
};

const MyNumberInput: React.FC<Props> = (props) => {
  const { label, fullWidth, value, onChange, decimalScale, className, id, max, onBlur } = props;
  // useEffect(() => {}, []);

  return (
    <NumberFormat
      label={label}
      max={max}
      decimalScale={decimalScale}
      decimalSeparator={'.'}
      thousandSeparator={','}
      fullWidth={fullWidth === false ? false : true}
      value={value}
      customInput={TextField}
      inputProps={{
        className: className,
        id: id
      }}
      onValueChange={(value) => {
        if (!value.floatValue) {
          value.floatValue = 0;
        }
        onChange(value.floatValue);
      }}
      onBlur={onBlur}
    />
  );
};

// type StyleProps = {};
// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyNumberInput;
