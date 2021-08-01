import React, { useState } from 'react';

import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  CardHeader,
  Typography,
  IconButton,
  TextField,
} from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { TaskList } from 'models';
import { PopoverControl } from 'templates';
import { TitleForm } from '..';
import { ListMenu } from '.';

const maxRow = 2;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1.25),
      paddingBottom: 0,
    },
    content: {
      maxWidth: '93%',
      marginTop: -theme.spacing(0.25),
    },
    action: { marginTop: -theme.spacing(0.5) },
    title: {
      color: theme.palette.secondary.contrastText,
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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

type ListCardHeaderProps = {
  list: TaskList;
};

const ListCardHeader: React.FC<ListCardHeaderProps> = (props) => {
  const { list } = props;
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
        type='list'
        data={list}
        handleClose={handleCloseForm}
        defaultValue={list.title}
        multiline
        InputProps={{
          classes: {
            root: classes.title,
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
        defaultValue={list.title}
        inputProps={{ title: list.title }}
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

export default ListCardHeader;
