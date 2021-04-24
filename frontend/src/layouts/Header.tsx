import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import { APP_NAME } from '../config/app';
import { isSignedIn } from '../utils/auth';
import Sidebar from './Sidebar';
import PopoverControl from '../templates/PopoverControl';
import AccountMenuList from '../components/Header/AccountMenuList';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  buttonLink: {
    color: 'inherit',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event?.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    )
      return;
    setOpen(open);
  };

  const SignInLinkButton = () => (
    <Link to={'/login'} className={classes.buttonLink}>
      <Button
        variant='contained'
        color='secondary'
        startIcon={<AccountCircleIcon />}
      >
        {'ログイン'}
      </Button>
    </Link>
  );

  const AccountMenuButton = () => (
    <PopoverControl
      trigger={
        <IconButton>
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
            {APP_NAME}
          </Link>
        </div>
        {isSignedIn() ? <AccountMenuButton /> : <SignInLinkButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
