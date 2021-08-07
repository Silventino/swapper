import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import 'reflect-metadata';

const RainbowDiv: React.FC = (props) => {
  const classes = useStyles();

  return (
    <div className={'rainbow'}>
      <div style={{ zIndex: 10, position: 'inherit', padding: '10px' }}>{props.children}</div>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => createStyles({}));

export default RainbowDiv;
