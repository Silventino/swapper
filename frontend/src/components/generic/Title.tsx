import { Theme, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import React, { useEffect } from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import clsx from 'clsx';

type Props = {
  variant?: Variant;
  fontSize?: number;
  style?: any;
  className?: string;
};

const Title: React.FC<Props> = (props) => {
  const { variant, fontSize, className } = props;
  const classes = useStyles({ fontSize });

  return (
    <Typography className={clsx(classes.title, className)} variant={variant ?? 'h1'}>
      {props.children}
    </Typography>
  );
};

type StyleProps = {
  fontSize?: number;
};

const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    title: (props) => ({
      color: '#fff',
      fontSize: props.fontSize ?? 20,
      margin: 0
    })
  })
);

export default Title;
