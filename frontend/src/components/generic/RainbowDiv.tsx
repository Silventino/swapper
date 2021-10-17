import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';
import 'reflect-metadata';

const RainbowDiv: React.FC = (props) => {
  const classes = useStyles();

  return <div className={'rainbowGradient'}>{props.children}</div>;
};

const useStyles = makeStyles<Theme>((theme) => createStyles({}));

export default RainbowDiv;
