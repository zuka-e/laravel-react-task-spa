import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, ClickAwayListener } from '@material-ui/core';

import theme from 'theme';
import * as Model from 'models';
import { useAppDispatch } from 'utils/hooks';
import { openInfoBox } from 'store/slices/taskBoardSlice';
import { TypographyWithLimitedRows } from 'templates';

const defaultPadding = theme.spacing(1.5);
const borderWidth = '2px';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: theme.shadows[1],
      cursor: 'pointer',
      '&:hover': { opacity: 0.8 },
      '& > p': { padding: defaultPadding },
    },
    selected: {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.primary.light,
      border: borderWidth + ' solid ' + theme.palette.primary.main,
      '& > p': { padding: `calc(${defaultPadding}px - ${borderWidth})` },
    },
  })
);

type TaskCardProps = {
  card: Model.TaskCard;
  cardIndex: number;
  listIndex: number;
};

const TaskCard: React.FC<TaskCardProps> = (props) => {
  const { card } = props;
  const classes = useStyles();
  const [selected, setSelected] = useState(false);
  const dispatch = useAppDispatch();
  const className = `card ${classes.root} ${selected && classes.selected}`;

  const handleClick = () => {
    setSelected(true);
    dispatch(openInfoBox({ type: 'card', data: card }));
  };

  return (
    <ClickAwayListener onClickAway={() => setSelected(false)}>
      <Card onClick={handleClick} className={className}>
        <TypographyWithLimitedRows title={card.title} className='cardTitle'>
          {card.title}
        </TypographyWithLimitedRows>
      </Card>
    </ClickAwayListener>
  );
};

export default TaskCard;
