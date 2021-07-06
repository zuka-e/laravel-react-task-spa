import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons';

import { TaskList } from 'models';
import { useAppDispatch } from 'utils/hooks';
import { openInfoBox } from 'store/slices/taskBoardSlice';

const menuItem = {
  info: '詳細を表示',
};

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({ root: { maxWidth: '300px' } })
);

type ListMenuProps = {
  list: TaskList;
};

const ListMenu: React.FC<ListMenuProps> = (props) => {
  const { list } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const handleClick = () => dispatch(openInfoBox({ type: 'list', data: list }));

  return (
    <List component='nav' aria-label='list-menu' dense className={classes.root}>
      <ListItem button onClick={handleClick} className='listInfoBtn'>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText
          title={menuItem.info}
          primary={menuItem.info}
          className='listInfoBtnText'
        />
      </ListItem>
    </List>
  );
};

export default ListMenu;
