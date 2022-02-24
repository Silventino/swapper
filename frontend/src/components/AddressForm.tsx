import { Grid, IconButton, Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useContext, useEffect, useState } from 'react';
import 'reflect-metadata';
import { colors } from 'src/constants';
import { showNotification } from 'src/helpers/helper';
import WalletContext from 'src/providers/WalletContextProvider';
import '../App.css';
import ConnectedWalletSelect from './generic/ConnectedWalletSelect';
import MyInput from './generic/MyInput';
import MyModal from './generic/MyModal';
import MyNumberInput from './generic/MyNumberInput';
import Title from './generic/Title';

type Props = {
  addressA: string;
  setAddressA: (x: string) => void;
  addressB: string;
  setAddressB: (x: string) => void;

  minutes: number;
  setMinutes: (x: number) => void;
};

const AddressForm: React.FC<Props> = (props) => {
  const { addressA, setAddressA, addressB, setAddressB, minutes, setMinutes } = props;
  const walletContext = useContext(WalletContext);

  const [openModalConfig, setOpenModalConfig] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (!addressA) {
      setAddressA(walletContext.selectedAccount!.address);
    }
  }, [addressA, setAddressA, walletContext.selectedAccount]);

  const loadAssetsFromAddress = async () => {
    try {
      await walletContext.loadAssetsFromAddress(addressB);
      showNotification('Assets loaded from second address.');
    } catch (err) {
      console.log('err', err);
      showNotification('Error while loading assets from account.');
    }
  };

  return (
    <div className={classes.container}>
      <MyModal open={openModalConfig} onClose={() => setOpenModalConfig(false)}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ marginBottom: 15 }}>
            <Title>Advanced Config.</Title>
          </Grid>
          <Grid item xs={12}>
            <MyNumberInput
              id={'minutes'}
              label={'Time limit (minutes)'}
              fullWidth
              decimalScale={0}
              value={minutes}
              onChange={(txt) => setMinutes(txt)}
            />
          </Grid>
        </Grid>
      </MyModal>

      <Grid container spacing={4}>
        <Grid item xs={12} className={classes.header}>
          <div className={classes.emptyDiv} />

          <Title className={classes.title} variant={'h4'}>{`Who is swapping?`}</Title>

          <IconButton onClick={() => setOpenModalConfig(true)}>
            <SettingsIcon />
          </IconButton>
        </Grid>

        <Grid item xs={12} md={6}>
          <ConnectedWalletSelect
            label={'Your Address'}
            value={addressA}
            onChange={(txt) => {
              setAddressA(txt);
              walletContext.selectAccount(txt).catch((err) => {});
            }}
            inputId={'personA-addr'}
          />
        </Grid>

        <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <MyInput
            className={classes.input}
            label={"Other's Address"}
            fullWidth
            value={addressB}
            onChange={(txt) => setAddressB(txt)}
            maxLength={58}
            inputId={'personB-addr'}
            endAdornment={
              <IconButton onClick={() => loadAssetsFromAddress()} disabled={addressB.length !== 58}>
                <SearchIcon />
              </IconButton>
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    container: {
      backgroundColor: colors.background,
      padding: '0px 20px 20px 20px',
      borderRadius: '5px'
    },
    img: {
      width: 200,
      height: 200,
      objectFit: 'contain',
      borderRadius: 7
    },
    buttonDiv: {
      paddingTop: 15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    input: {
      // margin: 10
    },
    title: {},
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 10
    },
    emptyDiv: {
      width: 40,
      height: 40
    }
  })
);

export default AddressForm;
