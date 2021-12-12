import React from 'react';

import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardHeader, Typography, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { TaskList } from 'models';
import { PopoverControl } from 'templates';
import { EditableTitle } from '..';
import { ListMenu } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
      paddingBottom: 0,
    },
    action: { marginTop: 0 },
    title: {
      color: theme.palette.secondary.contrastText,
      fontWeight: 'bold',
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 1,
    },
  })
);

type ListCardHeaderProps = {
  list: TaskList;
};

const ListCardHeader: React.FC<ListCardHeaderProps> = (props) => {
  const { list } = props;
  const classes = useStyles();

  const Title = () => (
    <EditableTitle
      method='PATCH'
      model='list'
      data={list}
      disableMargin
      inputStyle={classes.title}
    />
  );

  const Subheader = () => (
    <Typography color='textSecondary' variant='body2'>
      {moment(list.updatedAt).calendar()}
    </Typography>
  );

  const Action = () => (
    <PopoverControl
      trigger={
        <IconButton size='small'>
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListMenu list={list} />
    </PopoverControl>
  );

  return (
    <CardHeader
      classes={{
        root: classes.root,
        action: classes.action,
      }}
      disableTypography
      title={<Title />}
      subheader={<Subheader />}
      action={<Action />}
    />
  );
};

export default ListCardHeader;
