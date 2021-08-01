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
  getOptionLabel: (x: T) => string;
  value: T;
  setValue: (x: T) => void;
};

function MySelect<T>(props: Props<T>) {
  const { label, options, getOptionLabel, value, setValue } = props;

  useEffect(() => {}, []);

  return (
    <FormControl variant="filled">
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
