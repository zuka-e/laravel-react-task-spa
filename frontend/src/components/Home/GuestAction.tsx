import React from 'react';

import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, List, ListItem } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

import { GUEST_EMAIL, GUEST_NAME, GUEST_PASSWORD } from 'config/app';
import { createUser, signInWithEmail } from 'store/thunks';
import { useAppDispatch } from 'utils/hooks';
import { makeEmail } from 'utils/generator';
import { PopoverControl } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    info: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.info.light,
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
    },
  })
);

const GuestAction: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleGuestSignUp = () => {
    const user = {
      name: GUEST_NAME,
      email: makeEmail(),
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };

    history.push('/register'); // メール送信ページを表示するため
    dispatch(createUser(user));
  };

  const handleGuestSignIn = () => {
    const email = GUEST_EMAIL;
    const password = GUEST_PASSWORD;
    dispatch(signInWithEmail({ email, password }));
  };

  return (
    <PopoverControl
      trigger={
        <Button
          startIcon={<MenuIcon />}
          variant='contained'
          className={classes.info}
        >
          又はゲストユーザーで試す
        </Button>
      }
    >
      <List component='nav'>
        <ListItem button onClick={handleGuestSignUp}>
          登録 (メール認証不可)
        </ListItem>
        <ListItem button onClick={handleGuestSignIn}>
          ログイン (メール認証済み)
        </ListItem>
      </List>
    </PopoverControl>
  );
};

export default GuestAction;
