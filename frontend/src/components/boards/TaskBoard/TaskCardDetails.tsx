import React, { useState } from 'react';

import * as yup from 'yup';
import moment from 'moment';
import { useParams } from 'react-router-dom';
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
} from '@material-ui/icons';

import { TaskCard } from 'models';
import { useAppDispatch, useDeepEqualSelector } from 'utils/hooks';
import { closeInfoBox } from 'store/slices/taskBoardSlice';
import { updateTaskCard } from 'store/thunks/cards';
import { DatetimeInput } from 'templates';
import { EditableTitle, EditableText } from '..';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: 0,
    },
    breadcrumbs: { '& li > *': { display: 'flex', alignItems: 'center' } },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
    close: { marginLeft: 'auto' },
    cardHeader: { paddingBottom: 0 },
    rows: {
      paddingTop: 0,
      '& > div': {
        marginBottom: theme.spacing(1),
        alignItems: 'center',
      },
    },
    label: { flex: '0 0 100px' },
    timeout: { color: theme.palette.error.main },
    text: { whiteSpace: 'pre-wrap' },
    contentBlock: { marginTop: theme.spacing(2) },
  })
);

type TaskCardDetailsProps = {
  card: TaskCard;
};

const TaskCardDetails: React.FC<TaskCardDetailsProps> = (props) => {
  const { card } = props;
  const classes = useStyles();
  const params = useParams<{ userId: string; boardId: string }>();
  const dispatch = useAppDispatch();
  const list = useDeepEqualSelector((state) =>
    state.boards.docs[params.boardId].lists.find(
      (list) => list.id === card.listId
    )
  );
  const [checked, setChecked] = useState(card.done);

  const isInTime = (date: Date) => moment(date).isBefore(new Date(), 'minute');

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

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing>
        <Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
          <a
            href={`${window.location.origin}${window.location.pathname}#${list?.id}`}
          >
            <ListAltIcon className={classes.icon} />
            {list?.title}
          </a>
          <Typography>
            <AssignmentIcon className={classes.icon} />
            {'Card'}
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
        classes={{ root: classes.cardHeader }}
        title={<EditableTitle method='PATCH' type='card' data={card} />}
      />
      <CardContent className={classes.rows}>
        <FormControlLabel
          label={checked ? 'Completed' : 'Incompleted'}
          control={
            <Checkbox
              color='primary'
              checked={checked}
              onChange={handleCheckbox}
            />
          }
        />
        <Grid container>
          <Grid item className={classes.label}>
            <label className={isInTime(card.deadline) ? classes.timeout : ''}>
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
        <div className={classes.contentBlock}>
          <EditableText
            method='PATCH'
            type='card'
            data={card}
            schema={yup.object().shape({
              content: yup.string().max(Math.floor(65535 / 3)),
            })}
            defaultValue={card.content}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCardDetails;
