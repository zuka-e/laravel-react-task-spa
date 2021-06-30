import React from 'react';

import moment from 'moment';
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
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import theme from 'theme';
import { TaskCard } from 'models';
import { closeInfoBox, removeInfoBox } from 'store/slices/taskBoardSlice';
import { useAppDispatch } from 'utils/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: 0,
    },
    close: { marginLeft: 'auto' },
    rows: {
      '& > div': {
        marginBottom: theme.spacing(1),
        alignItems: 'center',
      },
    },
    label: { flex: '0 0 100px' },
    text: { whiteSpace: 'pre-wrap' },
    timeout: { color: theme.palette.error.main },
  })
);

type TaskCardDetailsProps = {
  card: TaskCard;
};

const TaskCardDetails: React.FC<TaskCardDetailsProps> = (props) => {
  const { card } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const isInTime = (date: Date) => moment(date).isBefore(new Date(), 'minute');

  const handleToggleDone = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // toggle `done`
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
        <IconButton
          aria-label='close'
          onClick={handleClose}
          className={classes.close}
        >
          <CloseIcon />
        </IconButton>
      </CardActions>
      <CardHeader
        title={
          <Typography className={classes.text} variant='h5' component='p'>
            {card.title}
          </Typography>
        }
      />
      <CardContent className={classes.rows}>
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
