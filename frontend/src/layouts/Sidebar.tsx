import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: '250px',
  },
  listHeader: {
    display: 'flex',
    padding: '4px',
  },
  listHeaderTitle: {
    marginLeft: theme.spacing(2),
    lineHeight: 'unset',
  },
}));

type SidebarProps = {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { toggleDrawer } = props;
  const classes = useStyles();

  return (
    <div className={classes.drawer}>
      <List
        component='nav'
        aria-labelledby='menu-header'
        subheader={
          <ListSubheader
            className={classes.listHeader}
            component='div'
            id='menu-header'
          >
            <IconButton onClick={toggleDrawer(false)}>
              <MenuIcon />
            </IconButton>
            <Typography className={classes.listHeaderTitle}>Menu</Typography>
          </ListSubheader>
        }
      >
        <Divider />
      </List>
    </div>
  );
};

export default Sidebar;
