import React, { useEffect, useState } from 'react';

import * as yup from 'yup';
import moment from 'moment';
import { useParams, useLocation } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Breadcrumbs,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  ListAlt as ListAltIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

import { TaskCard } from 'models';
import { useAppDispatch, useDeepEqualSelector } from 'utils/hooks';
import { closeInfoBox } from 'store/slices/taskBoardSlice';
import { updateTaskCard } from 'store/thunks/cards';
import {
  AlertButton,
  DatetimeInput,
  DeleteTaskDialog,
  MarkdownEditor,
} from 'templates';
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
    rightAction: { marginLeft: 'auto' },
    header: { paddingBottom: 0 },
    rows: {
      paddingTop: 0,
      paddingBottom: 0,
      '& > div': {
        marginBottom: theme.spacing(1),
        alignItems: 'center',
      },
    },
    label: { flex: '0 0 100px' },
    timeout: { color: theme.palette.error.main },
    footer: { flex: '1 1 auto' },
  })
);

type TaskCardDetailsProps = {
  card: TaskCard;
};

const TaskCardDetails: React.FC<TaskCardDetailsProps> = (props) => {
  const { card } = props;
  const classes = useStyles();
  const location = useLocation();
  const params = useParams<{ userId: string; boardId: string }>();
  const dispatch = useAppDispatch();
  const list = useDeepEqualSelector((state) =>
    state.boards.docs[params.boardId].lists.find(
      (list) => list.id === card.listId
    )
  );
  const [checked, setChecked] = useState(card.done);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setChecked(card.done);
  }, [card.done]);

  const targetCard = {
    id: card.id,
    boardId: card.boardId,
    listId: card.listId,
  };

  const isInTime = (date: Date) => moment(new Date()).isBefore(date, 'minute');

  const handleCheckbox = () => {
    setChecked(!checked);
    dispatch(
      updateTaskCard({
        id: card.id,
        boardId: card.boardId,
        listId: card.listId,
        done: !card.done,
      })
    );
  };

  const handleClose = () => {
    dispatch(closeInfoBox());
  };

  const handleDateChange = (date?: Date) => {
    dispatch(
      updateTaskCard({
        id: card.id,
        boardId: card.boardId,
        listId: card.listId,
        deadline: date,
      })
    );
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleSubmitText = (text: string) => {
    dispatch(updateTaskCard({ ...targetCard, content: text }));
  };

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing>
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          <a href={`${location.pathname}#${list?.id}`}>
            <ListAltIcon className={classes.icon} />
            {list?.title}
          </a>
          <Typography>
            <AssignmentIcon className={classes.icon} />
            {'Card'}
          </Typography>
        </Breadcrumbs>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          className={classes.rightAction}
        >
          <CloseIcon />
        </IconButton>
      </CardActions>
      <CardHeader
        classes={{ root: classes.header }}
        title={<EditableTitle method="PATCH" model="card" data={card} />}
      />
      <CardContent className={classes.rows}>
        <FormControlLabel
          label={card.done ? 'Completed' : 'Incompleted'}
          control={
            <Checkbox
              color="primary"
              checked={card.done}
              onChange={handleCheckbox}
            />
          }
        />
        <Grid container>
          <Grid item className={classes.label}>
            <label
              className={
                !isInTime(card.deadline) && !card.done ? classes.timeout : ''
              }
            >
              締切日時
            </label>
          </Grid>
          <Grid item>
            <DatetimeInput onChange={handleDateChange} value={card.deadline} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>作成日時</label>
          </Grid>
          <Grid item>{moment(card.createdAt).calendar()}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.label}>
            <label>変更日時</label>
          </Grid>
          <Grid item>{moment(card.updatedAt).calendar()}</Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <MarkdownEditor
          onSubmit={handleSubmitText}
          schema={yup.object().shape({
            content: yup.string().label('Content').max(2000),
          })}
          defaultValue={card.content}
        />
      </CardContent>

      <CardActions className={classes.footer}>
        {openDeleteDialog && (
          <DeleteTaskDialog
            model="card"
            data={card}
            setOpen={setOpenDeleteDialog}
          />
        )}
        <AlertButton
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
          title="削除"
          color="danger"
          className={classes.rightAction}
        >
          削除
        </AlertButton>
      </CardActions>
    </Card>
  );
};

export default TaskCardDetails;
