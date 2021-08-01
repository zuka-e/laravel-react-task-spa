import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Info as InfoIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { TaskList } from 'models';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { activateEventAttr as activateInfoBoxEventAttr } from 'utils/infoBox';
import { openInfoBox } from 'store/slices/taskBoardSlice';
import { DeleteTaskDialog } from 'templates';

const menuItem = {
  info: '詳細を表示',
  delete: '削除',
} as const;

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({ root: { maxWidth: '300px' } })
);

type ListMenuProps = {
  list: TaskList;
};

const ListMenu: React.FC<ListMenuProps> = (props) => {
  const { list } = props;
  const classes = useStyles();
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const dispatch = useAppDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isSelected = () => list.id === selectedId;

  const handleClick = (key: keyof typeof menuItem) => () => {
    if (isSelected()) activateInfoBoxEventAttr('shown');

    switch (key) {
      case 'info':
        dispatch(openInfoBox({ type: 'list', data: list }));
        break;
      case 'delete':
        setOpenDeleteDialog(true);
        break;
    }
  };

  return (
    <List component='nav' aria-label='list-menu' dense className={classes.root}>
      <ListItem button onClick={handleClick('info')} title={menuItem.info}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary={menuItem.info} />
      </ListItem>
      {openDeleteDialog && (
        <DeleteTaskDialog
          type='list'
          data={props.list}
          setOpen={setOpenDeleteDialog}
        />
      )}
      <ListItem button onClick={handleClick('delete')} title={menuItem.delete}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary={menuItem.delete} />
      </ListItem>
    </List>
  );
};

export default ListMenu;
