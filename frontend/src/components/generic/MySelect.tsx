import {
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import React, { useEffect } from "react";

import MySelectBase from "./MySelectBase";

type Props<T> = {
  label: string;
  options: T[];
  getOptionLabel: (x: T | null) => string;
  value: T | null;
  setValue: (x: T) => void;
  fullWidth?: boolean;
};

function MySelect<T>(props: Props<T>) {
  const { label, options, getOptionLabel, value, setValue, fullWidth } = props;

  useEffect(() => {}, []);

  return (
    <FormControl
      // variant="filled"
      fullWidth={fullWidth === false ? false : true}
    >
      <InputLabel>{label}</InputLabel>
      <MySelectBase
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        setValue={setValue}
      />
    </FormControl>
  );
}

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MySelect;
