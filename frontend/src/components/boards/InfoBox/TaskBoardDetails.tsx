import React from 'react';

import * as yup from 'yup';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Breadcrumbs,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  FolderOpen as FolderOpenIcon,
  Folder as FolderIcon,
} from '@material-ui/icons';

import { TaskBoard } from 'models';
import { closeInfoBox } from 'store/slices/taskBoardSlice';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { EditableText, EditableTitle } from '..';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: 0,
    },
    breadcrumbs: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '& li > *': { display: 'flex', alignItems: 'center' },
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
    close: { marginLeft: 'auto' },
    cardHeader: { paddingBottom: 0 },
    rows: {
      paddingTop: 0,
      paddingBottom: 0,
      '& > div': {
        marginBottom: theme.spacing(1),
        alignItems: 'center',
      },
    },
    label: { flex: '0 0 100px', marginRight: theme.spacing(2) },
  })
);

type TaskBoardDetailsProps = {
  board: TaskBoard;
};

const TaskBoardDetails: React.FC<TaskBoardDetailsProps> = (props) => {
  const { board } = props;
  const classes = useStyles();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();

  const totalList = board.lists.reduce(
    (acc, current) => acc + current.cards.length,
    0
  );

  const totalCompletedCard = board.lists.reduce((acc, list) => {
    const totalCompletedCardForEachList = list.cards.reduce(
      (acc, card) => (card.done ? acc + 1 : acc),
      0
    );
    return acc + totalCompletedCardForEachList;
  }, 0);

  const handleClose = () => {
    dispatch(closeInfoBox());
  };

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing>
        <Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
          <Link to={`/users/${userId}/boards`}>
            <FolderIcon className={classes.icon} />
            {'Boards'}
          </Link>
          <Typography>
            <FolderOpenIcon className={classes.icon} />
            {board.title}
          </Typography>
        </Breadcrumbs>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          size='small'
          className={classes.close}
        >
          <CloseIcon />
        </IconButton>
      </CardActions>
      <CardHeader
        className={classes.cardHeader}
        disableTypography
        title={<EditableTitle method='PATCH' type='board' data={board} />}
      />
      <CardContent className={classes.rows}>
        <Grid container>
          <Grid item className={classes.label}>
            <label>???????????????</label>
          </Grid>
          <Grid item>{board.lists.length}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>
              ???????????????
              <br />
              (?????? / ?????????)
            </label>
          </Grid>
          <Grid item>
            {totalList}&nbsp; ({totalCompletedCard}&nbsp;/&nbsp;
            {totalList - totalCompletedCard})
          </Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>????????????</label>
          </Grid>
          <Grid item>{moment(board.createdAt).calendar()}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>????????????</label>
          </Grid>
          <Grid item>{moment(board.updatedAt).calendar()}</Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <EditableText
          method='PATCH'
          type='board'
          data={board}
          schema={yup.object().shape({
            description: yup.string().max(Math.floor(65535 / 3)),
          })}
          defaultValue={board.description}
        />
      </CardContent>
    </Card>
  );
};

export default TaskBoardDetails;
