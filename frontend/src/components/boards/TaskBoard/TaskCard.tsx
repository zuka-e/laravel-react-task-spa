import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';

import theme from 'theme';
import * as Model from 'models';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
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
  const { root, selected } = useStyles();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.boards);

  const isSelected = (card: Model.TaskCard) =>
    state.infoBox.data?.id === card.id;

  const className = `${root} ${isSelected(card) && selected}`;

  const handleClick = () => {
    dispatch(openInfoBox({ type: 'card', data: card }));
  };

  return (
    <Card onClick={handleClick} className={className}>
      <TypographyWithLimitedRows color='textSecondary' title={card.title}>
        {card.title}
      </TypographyWithLimitedRows>
    </Card>
  );
};

export default TaskCard;
