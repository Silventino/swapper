import { IconButton, Modal, Paper } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
  hideClose?: boolean;
};

const MyModal: React.FC<Props> = (props) => {
  const { children, open, onClose, style, hideClose, ...other } = props;

  const BUTTON_SIZE = 50;

  // const openRef = useRef(false);

  // openRef.current = open;
  // useEffect(() => {
  //   openRef.current = open;
  // }, [open]);

  // useEffect(() => {
  //   const callback = () => {
  //     onClose();
  //   };
  //   document.addEventListener('backbutton', callback);
  //   return () => {
  //     document.removeEventListener('backbutton', callback);
  //   };
  // }, []);

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
      {...other}
      className={'MyModal'}
    >
      <Fade in={open}>
        <Paper
          style={{
            maxWidth: 'min(800px, 100vw)',
            marginTop: 10,
            marginBottom: 10,
            position: 'relative',
            paddingTop: hideClose !== true ? BUTTON_SIZE : 10,
            ...style
          }}
        >
          {hideClose !== true && (
            <IconButton
              onClick={() => onClose()}
              style={{
                height: BUTTON_SIZE,
                width: BUTTON_SIZE,
                position: 'absolute',
                top: 0,
                right: 0
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          <div
            style={{
              maxHeight: 'calc(100vh - 70px)',
              overflow: 'auto',
              paddingTop: 10
            }}
          >
            <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>{children}</div>
          </div>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default MyModal;
