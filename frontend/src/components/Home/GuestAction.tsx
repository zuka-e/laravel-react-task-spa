import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, List, ListItem } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import PopoverControl from '../../templates/PopoverControl';
import { useAppDispatch } from '../../store/hooks';
import { createUser, signInWithEmail } from '../../store/slices/authSlice';

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

const makeEmail = () => {
  const username =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const domain = 'example.com';
  const email = username + '@' + domain;
  return email;
};

const GuestAction: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const email = process.env.REACT_APP_GUEST_EMAIL;
  const password = process.env.REACT_APP_GUEST_PASSWORD;

  const handleGuestSignUp = () => {
    if (!password) return;

    history.push('/register'); // メール送信ページを表示するため
    dispatch(
      createUser({
        name: 'ゲストユーザー',
        email: makeEmail(),
        password: password,
        password_confirmation: password,
      })
    );
  };

  const handleGuestSignIn = () => {
    if (!email || !password) return;
    dispatch(signInWithEmail({ email, password, remember: undefined }));
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
