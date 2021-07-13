import React from 'react';

import { useHistory } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Folder as FolderIcon } from '@material-ui/icons';

import { useAppSelector } from 'utils/hooks';

const MenuAfterAuth: React.FC = () => {
  const history = useHistory();
  const currentUser = useAppSelector((state) => state.auth.user);
  const userId = currentUser?.id;

  const path = {
    boards: `/users/${userId}/boards`,
  } as const;

  const handleClick = (path: string) => () => history.push(path);

  return (
    <ListItem button onClick={handleClick(path.boards)}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={'Task Boards'} />
    </ListItem>
  );
};

export default MenuAfterAuth;
