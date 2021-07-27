import React, { useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

import { TaskBoard } from 'models';
import { DeleteBoardDialog } from '.';

const menuItem = {
  delete: '削除',
} as const;

type BoardMenuProps = {
  board: TaskBoard;
};

const BoardMenu: React.FC<BoardMenuProps> = (props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClick = (key: keyof typeof menuItem) => () => {
    switch (key) {
      case 'delete':
        setOpenDeleteDialog(true);
        break;
    }
  };

  return (
    <List component='nav' aria-label='board-menu' dense>
      {openDeleteDialog && (
        <DeleteBoardDialog board={props.board} setOpen={setOpenDeleteDialog} />
      )}
      <ListItem button onClick={handleClick('delete')}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText title={menuItem.delete} primary={menuItem.delete} />
      </ListItem>
    </List>
  );
};

export default BoardMenu;
