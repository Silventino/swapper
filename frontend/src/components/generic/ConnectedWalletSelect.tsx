import React, {useContext, useEffect, useState} from 'react';
import WalletContext, {AccountInfo} from '../../providers/WalletContextProvider';
import MySelect from './MySelect';

type Props = {
  label: string;
  fullWidth?: boolean;
  value: string;
  onChange: (x: string) => void;

  inputId?: string;
  className?: string;
};

const ConnectedWalletSelect: React.FC<Props> = (props) => {
  const { value, onChange, ...rest } = props;

  const [selected, setSelected] = useState<AccountInfo | null>(null);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    const newSelected = walletContext.accounts.find((item) => item.address === value);
    setSelected(newSelected ?? null);
  }, [value, walletContext.accounts]);

  return (
    <>
      <MySelect<AccountInfo>
        options={walletContext.accounts}
        getOptionLabel={(item) => item?.address ?? 'Not found'}
        value={selected}
        onChange={(newValue) => {
          onChange(newValue.address);
        }}
        {...rest}
      />
    </>
  );
};

// type StyleProps = {};
// const useStyles = makeStyles<Theme, StyleProps>((theme) => createStyles({}));

export default ConnectedWalletSelect;
