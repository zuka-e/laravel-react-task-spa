import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Drawer, Avatar, IconButton } from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';

import { APP_NAME } from 'config/app';
import { isSignedIn } from 'utils/auth';
import { LinkButton, LinkWrapper, PopoverControl } from 'templates';
import { AccountMenuList } from 'components/layouts/Header';
import Sidebar from './Sidebar';
import logo from 'images/logo.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { flexGrow: 1 },
    title: { marginLeft: theme.spacing(2) },
    avatar: { backgroundColor: theme.palette.secondary.dark },
  })
);

const Header: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event?.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      )
        return;
      setOpen(open);
    };

  const SignInLinkButton = () => (
    <LinkButton to="/login" color="secondary" startIcon={<AccountCircleIcon />}>
      {'ログイン'}
    </LinkButton>
  );

  const AccountMenuButton = () => (
    <PopoverControl
      trigger={
        <IconButton aria-label="account-menu">
          <Avatar alt="avatar" src={undefined} className={classes.avatar}>
            <PersonIcon />
          </Avatar>
        </IconButton>
      }
    >
      <div className={classes.root}>
        <AccountMenuList />
      </div>
    </PopoverControl>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Sidebar toggleDrawer={toggleDrawer} />
        </Drawer>
        <div className={`${classes.root} ${classes.title}`}>
          <LinkWrapper to={'/'}>
            <img src={logo.src} alt={APP_NAME} width="120" height="30" />
          </LinkWrapper>
        </div>
        {isSignedIn() ? <AccountMenuButton /> : <SignInLinkButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
