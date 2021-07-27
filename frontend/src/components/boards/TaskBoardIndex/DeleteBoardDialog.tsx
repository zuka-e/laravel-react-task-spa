import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from '@material-ui/core';

import { useAppDispatch } from 'utils/hooks';
import { destroyTaskBoard } from 'store/thunks/boards';
import { TaskBoard } from 'models';

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

type DeleteBoardDialogProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  board: TaskBoard;
};

const DeleteBoardDialog: React.FC<DeleteBoardDialogProps> = (props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const handleClose = () => props.setOpen(false);
  const handleDelete = () => dispatch(destroyTaskBoard(props.board));

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        本当にボードを削除しますか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          ボード消滅後は復元することはできません。
          このボードで作成したデータは、リスト及びカードも含め全て削除されます。
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
  );
};

export default DeleteBoardDialog;
