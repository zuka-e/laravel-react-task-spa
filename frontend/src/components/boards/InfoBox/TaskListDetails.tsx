import React from 'react';

import * as yup from 'yup';
import moment from 'moment';
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
  Tooltip,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  ListAlt as ListAltIcon,
  FolderOpen as FolderOpenIcon,
} from '@material-ui/icons';

import { TaskList } from 'models';
import { closeInfoBox } from 'store/slices/taskBoardSlice';
import { updateTaskList } from 'store/thunks/lists';
import { useAppDispatch, useAppSelector, useRoute } from 'utils/hooks';
import { MarkdownEditor } from 'templates';
import { EditableTitle } from '..';

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

type TaskListDetailsProps = {
  list: TaskList;
};

const TaskListDetails: React.FC<TaskListDetailsProps> = (props) => {
  const { list } = props;
  const classes = useStyles();
  const { pathname, pathParams } = useRoute();
  const boardName = useAppSelector(
    (state) => state.boards.docs[pathParams.boardId?.toString()].title
  );
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeInfoBox());
  };

  const handleSubmitText = (text: string) => {
    dispatch(
      updateTaskList({ id: list.id, boardId: list.boardId, description: text })
    );
  };

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing>
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          <Tooltip title={boardName}>
            <Typography>
              <FolderOpenIcon className={classes.icon} />
              {'Board'}
            </Typography>
          </Tooltip>
          <a href={`${pathname}#${list?.id}`} title={list.title}>
            <ListAltIcon className={classes.icon} />
            {list.title}
          </a>
        </Breadcrumbs>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          className={classes.close}
        >
          <CloseIcon />
        </IconButton>
      </CardActions>
      <CardHeader
        className={classes.cardHeader}
        disableTypography
        title={<EditableTitle method="PATCH" model="list" data={list} />}
      />
      <CardContent className={classes.rows}>
        <Grid container>
          <Grid item className={classes.label}>
            <label>タスク総数</label>
          </Grid>
          <Grid item>{list.cards.length}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>(完了済)</label>
          </Grid>
          <Grid item>{list.cards.filter((card) => card.done).length}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>作成日時</label>
          </Grid>
          <Grid item>{moment(list.createdAt).calendar()}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>変更日時</label>
          </Grid>
          <Grid item>{moment(list.updatedAt).calendar()}</Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <MarkdownEditor
          onSubmit={handleSubmitText}
          schema={yup.object().shape({
            content: yup.string().label('Description').max(2000),
          })}
          defaultValue={list.description}
        />
      </CardContent>
    </Card>
  );
};

export default TaskListDetails;
