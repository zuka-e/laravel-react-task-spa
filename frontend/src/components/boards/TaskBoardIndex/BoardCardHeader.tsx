import React, { useState } from 'react';

import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  CardHeader,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { TaskBoard } from 'models';
import { PopoverControl } from 'templates';
import { TitleForm } from '..';
import { BoardMenu } from '.';

const maxRow = 2;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
      justifyContent: 'space-between',
    },
    content: { maxWidth: '93%' },
    action: { alignSelf: 'flex-end' },
    title: {
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': maxRow,
      overflow: 'hidden',
    },
    subheader: {
      paddingLeft: theme.spacing(0.75),
    },
    notchedOutline: { border: 'none' },
    multilineDense: {
      padding: theme.spacing(0.75),
    },
    helperTextDense: {
      marginTop: '1px',
      marginLeft: theme.spacing(1),
    },
  })
);

type BoardCardHeaderProps = {
  board: TaskBoard;
};

const BoardCardHeader: React.FC<BoardCardHeaderProps> = (props) => {
  const { board } = props;
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenForm = () => {
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
  };

  const Title = () =>
    isEditing ? (
      <TitleForm
        method='PATCH'
        type='board'
        data={board}
        handleClose={handleCloseForm}
        defaultValue={board.title}
        multiline
        InputProps={{
          classes: {
            multiline: classes.multilineDense,
          },
        }}
        FormHelperTextProps={{
          margin: 'dense',
          classes: { marginDense: classes.helperTextDense },
        }}
      />
    ) : (
      <TextField
        onClick={handleOpenForm}
        fullWidth
        defaultValue={board.title}
        inputProps={{ title: board.title }}
        multiline
        rowsMax={maxRow}
        variant='outlined'
        InputProps={{
          classes: {
            multiline: classes.multilineDense,
            inputMultiline: classes.title,
            notchedOutline: classes.notchedOutline,
          },
        }}
      />
    );

  const Subheader = () => (
    <Typography
      color='textSecondary'
      variant='body2'
      classes={{ body2: classes.subheader }}
    >
      {moment(board.updatedAt).calendar()}
    </Typography>
  );

  const MenuButton = () => (
    <Tooltip title='Menu' enterDelay={500}>
      <IconButton aria-label='board-menu' size='small'>
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
        content: classes.content,
        action: classes.action,
      }}
      disableTypography
      title={<Title />}
      subheader={isEditing ? undefined : <Subheader />}
      action={<Action />}
    />
  );
};

export default BoardCardHeader;
