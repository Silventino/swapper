import { createStyles, IconButton, makeStyles, Menu, MenuItem, Theme } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import React, { useContext } from 'react';
import MyInput from './MyInput';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import WalletContext from '../WalletContextProvider';

type Props = {
  label: string;
  fullWidth?: boolean;
  value: string;
  onChange: (x: string) => void;
};

const MyAddressInput: React.FC<Props> = (props) => {
  const { ...rest } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const walletContext = useContext(WalletContext);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelect = (address: string) => {
    handleClose();
    props.onChange(address);
  };

  return (
    <>
      <MyInput
        {...rest}
        endAdornment={
          <IconButton onClick={handleClick}>
            <AccountBalanceWalletIcon />
          </IconButton>
        }
      />

      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {walletContext.accounts.map((item) => (
          <MenuItem key={item.address} onClick={() => onSelect(item.address)}>
            {item.address}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

type StyleProps = {};

const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default MyAddressInput;
