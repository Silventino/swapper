// import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import InfinityLoader from 'src/assets/infinity.svg';

type Props = { size?: number };

const Loader: React.FC<Props> = (props) => {
  const { size } = props;

  return (
    <object type="image/svg+xml" data={InfinityLoader} style={{ color: '#fff', width: size ?? 100 }}>
      svg-animation
    </object>
  );
};

// type StyleProps = {};

// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default Loader;
