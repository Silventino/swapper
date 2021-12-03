import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import clsx from 'clsx';
import React, { useState } from 'react';

const Banner: React.FC = (props) => {
  // const walletContext = useContext(WalletContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);



  return (
    <div className={clsx(classes.container)}>
      <img
        src={"https://media.discordapp.net/attachments/912161232625225769/913267708345319424/blanks_91.png?width=650&height=650"}
        style={{width: 200, height: 200}}
       />
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      height: 200,
      width: 200,
      backgroundColor: '#f00',
      zIndex: 10
    }

  })
);

export default Banner;
