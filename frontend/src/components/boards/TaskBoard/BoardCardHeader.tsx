import React from 'react';

import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardHeader, Typography, Tooltip, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { TaskBoard } from 'models';
import { PopoverControl } from 'templates';
import { EditableTitle } from '..';
import { BoardMenu } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1.5),
      paddingTop: theme.spacing(0.5),
    },
    action: { alignSelf: 'flex-end' },
    title: {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 1,
    },
  })
);

type BoardCardHeaderProps = {
  board: TaskBoard;
};

const BoardCardHeader: React.FC<BoardCardHeaderProps> = (props) => {
  const { board } = props;
  const classes = useStyles();

  const Title = () => (
    <EditableTitle
      method="PATCH"
      model="board"
      data={board}
      disableMargin
      inputStyle={classes.title}
    />
  );

  const Subheader = () => (
    <Typography color="textSecondary" variant="body2">
      {moment(board.updatedAt).calendar()}
    </Typography>
  );

  const MenuButton = () => (
    <Tooltip title="Menu" enterDelay={500}>
      <IconButton aria-label="board-menu" size="small">
        <MoreVertIcon />
      </IconButton>
    </Tooltip>
  );

  const Action = () => (
    <PopoverControl trigger={<MenuButton />}>
      <BoardMenu board={board} />
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

export default BoardCardHeader;
