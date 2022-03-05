import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useEffect, useState } from 'react';

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

const ImgWithLoader: React.FC<Props> = (props) => {
  const { src, alt, className } = props;
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
  }, [src]);

  return (
    <div style={{ position: 'relative' }}>
      <img
        src={src}
        alt={alt}
        className={className}
        style={loading ? { filter: 'blur(8px)' } : {}}
        onLoad={() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }}
      />

      {loading && <span className={classes.loader}>Loading...</span>}
    </div>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    loader: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 800,
      position: 'absolute',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 80,
      left: 0,
      right: 0,
      textAlign: 'center',

      textShadow: '#000 1px 0 8px'
    }
  })
);

export default ImgWithLoader;
