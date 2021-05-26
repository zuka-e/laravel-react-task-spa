import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from '@material-ui/core';
import { useAppDispatch } from '../../utils/hooks/useAppDipatch';
import { deleteAccount } from 'store/thunks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    triggerWrapper: { display: 'contents' },
    danger: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.error.main,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
  })
);

type DeleteAccountDialogProps = {
  trigger: JSX.Element;
};

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = (props) => {
  const { trigger } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteAccount());
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box onClick={handleClickOpen} className={classes.triggerWrapper}>
        {trigger}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          本当にアカウントを削除しますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            アカウント消滅後は復元することはできません。このアカウントで作成したデータも全て削除されます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' autoFocus>
            キャンセル
          </Button>
          <Button onClick={handleDelete} className={classes.danger}>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default DeleteAccountDialog;
