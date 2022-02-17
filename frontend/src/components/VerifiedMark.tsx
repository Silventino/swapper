import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import 'reflect-metadata';
import assetApi from '../api/assetApi';

type Props = {
  assetId: number;
};

const VerifiedMark: React.FC<Props> = (props) => {
  const { assetId } = props;
  const classes = useStyles();

  const [isVerifiedNft, setIsVerifiedNft] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getIsVerifiedNft = async () => {
      setIsVerifiedNft(false);
      setLoading(true);
      try {
        const res = await assetApi.getIsVerifiedNft(assetId);
        setIsVerifiedNft(res);
      } catch (err) {
        console.log(err);
        setIsVerifiedNft(false);
      }
      setLoading(false);
    };

    getIsVerifiedNft();
  }, [assetId]);

  if(loading) {
    return <div className={classes.center}>
      <p>Verifying...</p>
    </div>

  }

  if (!assetId || !isVerifiedNft) {
    return <div className={classes.center} />;
  }

  return (
    <div className={classes.center}>
      <p className={classes.text}>Verified NFT</p>
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 16 16"
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M15.67 7.066l-1.08-1.34a1.5 1.5 0 0 1-.309-.77l-.19-1.698a1.51 1.51 0 0 0-1.329-1.33l-1.699-.19c-.3-.03-.56-.159-.78-.329L8.945.33a1.504 1.504 0 0 0-1.878 0l-1.34 1.08a1.5 1.5 0 0 1-.77.31l-1.698.19c-.7.08-1.25.63-1.33 1.329l-.19 1.699c-.03.3-.159.56-.329.78L.33 7.055a1.504 1.504 0 0 0 0 1.878l1.08 1.34c.17.22.28.48.31.77l.19 1.698c.08.7.63 1.25 1.329 1.33l1.699.19c.3.03.56.159.78.329l1.339 1.08c.55.439 1.329.439 1.878 0l1.34-1.08c.22-.17.48-.28.77-.31l1.698-.19c.7-.08 1.25-.63 1.33-1.329l.19-1.699c.03-.3.159-.56.329-.78l1.08-1.339a1.504 1.504 0 0 0 0-1.878zM6.5 12.01L3 8.51l1.5-1.5 2 2 5-5L13 5.56l-6.5 6.45z"
        ></path>
      </svg>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#61DAFB',
      marginTop: 5,
      height: 25
    },
    text: {
      marginRight: 5
    }
  })
);

export default VerifiedMark;
