import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import {
  AppBar,
  Toolbar,
  Drawer,
  Avatar,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';
import { APP_NAME } from '../config/app';
import { isSignedIn } from '../utils/auth';
import Sidebar from './Sidebar';
import PopoverControl from '../templates/PopoverControl';
import AccountMenuList from '../components/Header/AccountMenuList';
import logo from '../images/logo.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      marginLeft: theme.spacing(2),
    },
    buttonLink: {
      '&:hover': {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
      },
    },
    pink: {
      color: theme.palette.getContrastText(pink[500]),
      backgroundColor: pink[500],
    },
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
    <Button
      component={Link}
      to='/login'
      variant='contained'
      color='secondary'
      startIcon={<AccountCircleIcon />}
      className={classes.buttonLink}
    >
      {'ログイン'}
    </Button>
  );

  const AccountMenuButton = () => (
    <PopoverControl
      trigger={
        <IconButton aria-label='account-menu'>
          <Avatar alt='avatar' src={undefined} className={classes.pink}>
            {<PersonIcon />}
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
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          edge='start'
          color='inherit'
          aria-label='menu'
          aria-controls='menu'
          aria-haspopup='true'
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor='left' open={open} onClose={toggleDrawer(false)}>
          {<Sidebar toggleDrawer={toggleDrawer} />}
        </Drawer>
        <div className={`${classes.root} ${classes.title}`}>
          <Link to={'/'} className={classes.buttonLink}>
            <img src={logo} alt={APP_NAME} width='120' height='30' />
          </Link>
        </div>
        {isSignedIn() ? <AccountMenuButton /> : <SignInLinkButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
