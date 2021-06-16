import React from 'react';

import moment from 'moment';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CardHeader, IconButton, Typography } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { TaskList } from 'models';
import { PopoverControl, ScrolledTypography } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: 0,
    },
    content: {
      maxWidth: '93%',
    },
    title: {
      fontWeight: 'bold',
    },
    action: {
      marginTop: -theme.spacing(0.5),
    },
  })
);

type ListCardHeaderProps = {
  list: TaskList;
};

const ListCardHeader: React.FC<ListCardHeaderProps> = (props) => {
  const { list } = props;
  const { root, content, title, action } = useStyles();

  const Title = () => (
    <ScrolledTypography className={title}>{list.title}</ScrolledTypography>
  );

  const Subheader = () => (
    <Typography color='textSecondary' variant='body2'>
      {moment(list.updatedAt).calendar()}
    </Typography>
  );

  const MenuButton = () => (
    <IconButton size='small'>
      <MoreVertIcon />
    </IconButton>
  );

  const Action = () => (
    <PopoverControl trigger={<MenuButton />}>
      {/* <ListMenu listId={list.id} /> */}
    </PopoverControl>
  );

  return (
    <CardHeader
      classes={{ root, content, action }}
      disableTypography
      title={<Title />}
      subheader={<Subheader />}
      action={<Action />}
    />
  );
};
export default ListCardHeader;
