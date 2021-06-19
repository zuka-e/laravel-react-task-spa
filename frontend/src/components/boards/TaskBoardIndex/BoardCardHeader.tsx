import React from 'react';

import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardHeader, Typography, Tooltip, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

import { TaskBoard } from 'models';
import { ScrolledTypography, PopoverControl, LightTooltip } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
      justifyContent: 'space-between',
    },
    content: {
      maxWidth: '93%',
    },
    action: {
      alignSelf: 'flex-end',
    },
  })
);

type BoardCardHeaderProps = {
  board: TaskBoard;
};

const BoardCardHeader: React.FC<BoardCardHeaderProps> = (props) => {
  const { board } = props;
  const { root, content, action } = useStyles();

  const Title = () => (
    <LightTooltip title={board.title} enterDelay={100}>
      <ScrolledTypography>{board.title}</ScrolledTypography>
    </LightTooltip>
  );

  const Subheader = () => (
    <Typography color='textSecondary' variant='body2'>
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
      {/* <BoardMenuList /> */}
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

export default BoardCardHeader;
