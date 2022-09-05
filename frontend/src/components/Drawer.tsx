import { Drawer, List, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import SwapIcon from '@mui/icons-material/Cached';
import ImageIcon from '@mui/icons-material/Image';
// import HistoryIcon from '@mui/icons-material/History';
// import FaqIcon from '@mui/icons-material/LiveHelp';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import logo_full from '../assets/logo_full.png';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHistory } from 'react-router';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  open: boolean;
  setOpen: (x: boolean) => void;
};

const MyDrawer: React.FC<Props> = (props) => {
  const { open, setOpen } = props;
  const classes = useStyles();

  const history = useHistory();

  return (
    <Drawer anchor={'left'} variant="temporary" open={open} onClose={() => setOpen(false)}>
      <div className={classes.drawer}>
        <img src={logo_full} alt="logo" className={classes.logo} />
        <List>
          <ListItem
            button
            onClick={() => {
              history.push('/');
              setOpen(false);
            }}
            className={classes.drawerItem}
          >
            <ListItemIcon>
              <SwapIcon />
            </ListItemIcon>
            <ListItemText primary={'New Swap'} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              history.push('/optout');
              setOpen(false);
            }}
            className={classes.drawerItem}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary={'Asset Opt-Out'} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              history.push('/optin');
              setOpen(false);
            }}
            className={classes.drawerItem}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={'Asset Opt-In'} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              history.push('/gallery');
              setOpen(false);
            }}
            className={classes.drawerItem}
          >
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary={'Gallery'} />
          </ListItem>

          {/* <ListItem button onClick={() => {}} className={classes.drawerItem} disabled>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary={'Swap History - SOON'} />
          </ListItem> */}

          {/* <ListItem button onClick={() => {}} className={classes.drawerItem} disabled>
            <ListItemIcon>
              <FaqIcon />
            </ListItemIcon>
            <ListItemText primary={'FAQ - SOON'} />
          </ListItem> */}
        </List>
      </div>
    </Drawer>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    logo: {
      // width: 35,
      height: 35,
      marginLeft: 5,
      marginRight: 2,
      objectFit: 'contain'
    },
    drawer: {
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    drawerItem: {
      paddingRight: 35
    }
  })
);

export default MyDrawer;
