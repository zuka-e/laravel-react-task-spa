import React from 'react';

import moment from 'moment';
import { useParams } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Box,
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
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import theme from 'theme';
import { TaskCard } from 'models';
import { closeInfoBox, removeInfoBox } from 'store/slices/taskBoardSlice';
import { useAppDispatch, useAppSelector } from 'utils/hooks';

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
      '& > div': {
        marginBottom: theme.spacing(1),
        alignItems: 'center',
      },
    },
    label: { flex: '0 0 100px' },
    timeout: { color: theme.palette.error.main },
    text: { whiteSpace: 'pre-wrap' },
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
  const state = useAppSelector((state) => state.boards);
  const board = state.docs[params.boardId];
  const list = board.lists.find((list) => list.id === card.listId);
  const baseUrl = `${window.location.origin}${window.location.pathname}`;

  const isInTime = (date: Date) => moment(date).isBefore(new Date(), 'minute');

  const handleToggleDone = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
  };

  const handleClose = () => {
    dispatch(closeInfoBox());
    setTimeout(
      () => dispatch(removeInfoBox()),
      theme.transitions.duration.standard + 200
    );
  };

  const handleDateChange = (date: MaterialUiPickersDate) => {
    // State managements
  };

  const handleDateClose = () => {
    // API requests
  };

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing>
        <Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
          <a href={`${baseUrl}#${list?.id}`}>
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
        className={classes.cardHeader}
        title={
          <Typography className={classes.text} variant='h5' component='p'>
            {card.title}
          </Typography>
        }
      />
      <CardContent className={classes.rows}>
        <FormControlLabel
          control={
            <Checkbox
              color='primary'
              checked={card.done}
              onClick={handleToggleDone}
            />
          }
          label={card.done ? 'Completed' : 'Incompleted'}
        />
        <Grid container>
          <Grid item className={classes.label}>
            <label className={isInTime(card.deadline) ? classes.timeout : ''}>
              締切日時
            </label>
          </Grid>
          <Grid item>
            <KeyboardDateTimePicker
              variant='inline'
              format='YYYY/MM/DD/ HH:mm'
              ampm={false}
              disablePast
              autoOk
              value={card.deadline}
              onChange={handleDateChange}
              onClose={handleDateClose}
            />
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
        <Box my={2}>
          <Typography className={classes.text}>{card.content}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCardDetails;
