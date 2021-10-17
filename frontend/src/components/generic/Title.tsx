import { Theme, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import React, { useEffect } from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';

type Props = {
  variant?: Variant;
  fontSize?: number;
};

const Title: React.FC<Props> = (props) => {
  const { variant, fontSize } = props;
  const classes = useStyles({ fontSize });

  return (
    <Typography className={classes.title} variant={variant ?? 'h1'}>
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
