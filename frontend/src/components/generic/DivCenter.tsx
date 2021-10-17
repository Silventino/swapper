import { Theme, Grid, GridProps } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import clsx from 'clsx';
import React, { HTMLAttributes, useEffect } from 'react';

type Props = HTMLAttributes<HTMLDivElement>;

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
