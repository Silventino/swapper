// import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

type Props = { size?: number };

const Loader: React.FC<Props> = (props) => {
  const { size } = props;

  return <PacmanLoader color={'#fff'} size={size ?? 30} />;
};

// type StyleProps = {};

// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default Loader;
