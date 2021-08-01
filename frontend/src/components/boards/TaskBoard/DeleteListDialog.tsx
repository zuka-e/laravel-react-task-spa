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

import { TaskList } from 'models';
import { useAppDispatch } from 'utils/hooks';
import { destroyTaskList } from 'store/thunks/lists';

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

type DeleteListDialogProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  list: TaskList;
};

const DeleteListDialog: React.FC<DeleteListDialogProps> = (props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const handleClose = () => props.setOpen(false);
  const handleDelete = () => dispatch(destroyTaskList(props.list));

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        本当にリストを削除しますか？
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          リスト消滅後は復元することはできません。
          このリストで作成したデータはカードも含めて全て削除されます。
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

export default DeleteListDialog;
