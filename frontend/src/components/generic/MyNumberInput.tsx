import {TextField} from "@material-ui/core";
import React from "react";
import NumberFormat from "react-number-format";

type Props = {
  label: string;
  fullWidth?: boolean;
  value: number;
  onChange: (x: number) => void;
  decimalScale?: number;
  className?: string;

  id?: string;
};

const MyNumberInput: React.FC<Props> = (props) => {
  const { label, fullWidth, value, onChange, decimalScale, className, id } = props;
  // useEffect(() => {}, []);

  return (
    <NumberFormat
      label={label}
      decimalScale={decimalScale}
      decimalSeparator={"."}
      thousandSeparator={","}
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
    />
  );
};

// type StyleProps = {};
// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyNumberInput;
