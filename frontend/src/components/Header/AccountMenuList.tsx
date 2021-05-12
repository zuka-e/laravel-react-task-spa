import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { putSignOut } from '../../store/slices/authSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '300px',
      overflowWrap: 'break-word',
    },
  })
);

const AccountMenuList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const history = useHistory();

  const handleSignOut = () => {
    dispatch(putSignOut());
  };

  return (
    <List component='nav' aria-label='sign-out' className={classes.root}>
      <ListItem button onClick={() => history.push('/account')}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary={user?.name} />
      </ListItem>
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
