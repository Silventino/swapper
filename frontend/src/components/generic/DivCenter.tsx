import { makeStyles, Theme, createStyles, Grid, GridProps } from '@material-ui/core';
import clsx from 'clsx';
import React, { useEffect } from 'react';

type Props = GridProps;

const DivCenter: React.FC<Props> = (props) => {
  const { className, children, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.gridCenter, className)} {...rest}>
      {children}
    </div>
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

export default DivCenter;
