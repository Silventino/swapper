import { createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import React from "react";
import NumberFormat from "react-number-format";

type Props = {
  label: string;
  fullWidth?: boolean;
  value: number;
  onChange: (x: number) => void;
  decimalScale?: number;
};

const MyNumberInput: React.FC<Props> = (props) => {
  const { label, fullWidth, value, onChange, decimalScale } = props;
  // useEffect(() => {}, []);

  return (
    <NumberFormat
      // isNumericString
      label={label}
      decimalScale={decimalScale}
      decimalSeparator={"."}
      thousandSeparator={","}
      fullWidth={fullWidth === false ? false : true}
      value={value}
      // variant={newVariant}
      // {...other}
      customInput={TextField}
      // inputProps={{
      //   // type: 'number',
      //   maxLength,
      //   style: {
      //     textAlign,
      //   },
      // }}
      // disabled={disabled}
      // onFocus={(e) => {
      //   if (autoSelect) {
      //     if (suffix === undefined) {
      //       e.target.select();
      //     } else {
      //       setTimeout(() => {
      //         e.target.select();
      //       }, 200);
      //     }
      //   }
      // }}
      onValueChange={(value) => {
        if (!value.floatValue) {
          value.floatValue = 0;
        }
        onChange(value.floatValue);
      }}
    />
  );
};

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyNumberInput;
