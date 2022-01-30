import {Grid, GridProps, Theme} from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import clsx from 'clsx';
import React from 'react';

type Props = GridProps;

const GridCenter: React.FC<Props> = (props) => {
  const { className, children, ...rest } = props;
  const classes = useStyles();

  return (
    <Grid className={clsx(classes.gridCenter, className)} {...rest}>
      {children}
    </Grid>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    gridCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  })
);

export default GridCenter;
