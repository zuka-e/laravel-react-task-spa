import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useAppDispatch } from '../../store/hooks';
import { putSignOut } from '../../store/slices/authSlice';

const AccountMenuList: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(putSignOut());
  };

  return (
    <List component='nav' aria-label='sign-out'>
      <ListItem button onClick={handleSignOut}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary='ログアウト' />
      </ListItem>
    </List>
  );
};

export default AccountMenuList;
