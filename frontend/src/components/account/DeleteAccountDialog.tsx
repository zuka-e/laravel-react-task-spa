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

import { deleteAccount } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { AlertButton } from 'templates';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    triggerWrapper: { display: 'contents' },
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

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    dispatch(deleteAccount());
  };

  return (
    <React.Fragment>
      <Box onClick={handleClickOpen} className={classes.triggerWrapper}>
        {trigger}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          本当にアカウントを削除しますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            アカウント消滅後は復元することはできません。このアカウントで作成したデータも全て削除されます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            キャンセル
          </Button>
          <AlertButton onClick={handleDelete} color="danger">
            削除
          </AlertButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteAccountDialog;
