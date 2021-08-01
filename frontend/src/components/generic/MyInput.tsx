import {
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import React, { ReactNode, useEffect } from "react";
import Visibility from "@material-ui/icons/Visibility";

type Props = {
  label: string;
  fullWidth?: boolean;
  endAdornment?: ReactNode;
  value: string;
  onChange: (x: string) => void;
};

const MyInput: React.FC<Props> = (props) => {
  const { label, fullWidth, endAdornment, value, onChange } = props;
  // useEffect(() => {}, []);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Input
        fullWidth={fullWidth}
        endAdornment={
          endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : undefined
        }
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormControl>
  );
};

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyInput;
