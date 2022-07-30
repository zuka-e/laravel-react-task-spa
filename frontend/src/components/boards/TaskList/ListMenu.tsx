import React, { useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Sort as SortIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

import { TaskList } from 'models';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { activateEventAttr } from 'utils/infoBox';
import { openInfoBox } from 'store/slices/taskBoardSlice';
import { DeleteTaskDialog, PopoverControl } from 'templates';
import { SortSelect } from '..';

const menuItem = {
  sort: '並び替え',
  info: '詳細を表示',
  delete: '削除',
} as const;

type ListMenuProps = {
  list: TaskList;
};

const ListMenu: React.FC<ListMenuProps> = (props) => {
  const { list } = props;
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const dispatch = useAppDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClick = (key: keyof typeof menuItem) => () => {
    if (list.id === selectedId) activateEventAttr('shown');

    switch (key) {
      case 'info':
        dispatch(openInfoBox({ model: 'list', data: list }));
        break;
      case 'delete':
        setOpenDeleteDialog(true);
        break;
    }
  };

  return (
    <List component="nav" aria-label="list-menu" dense>
      <PopoverControl
        position="left"
        trigger={
          <ListItem button title={menuItem.sort}>
            <ListItemIcon>
              <SortIcon />
            </ListItemIcon>
            <ListItemText primary={menuItem.sort + '...'} />
          </ListItem>
        }
      >
        <SortSelect model="card" boardId={list.boardId} listId={list.id} />
      </PopoverControl>
      <ListItem button onClick={handleClick('info')} title={menuItem.info}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary={menuItem.info} />
      </ListItem>
      {openDeleteDialog && (
        <DeleteTaskDialog
          model="list"
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
