import React, { useContext, useRef } from 'react';

import { useDrag, useDrop } from 'react-dnd';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';

import theme from 'theme';
import * as Model from 'models';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { activateEventAttr as activateInfoBoxEventAttr } from 'utils/infoBox';
import { openInfoBox } from 'store/slices/taskBoardSlice';
import { TypographyWithLimitedRows } from 'templates';
import { DragContext, DragItem, draggableItem } from '../DragContext';

const defaultPadding = theme.spacing(0.75);
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
    dragAndHover: { opacity: 0 },
  })
);

type TaskCardProps = {
  card: Model.TaskCard;
  cardIndex: number;
  listIndex: number;
};

const TaskCard: React.FC<TaskCardProps> = (props) => {
  const { card, cardIndex, listIndex } = props;
  const classes = useStyles();
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const dispatch = useAppDispatch();
  const { dragDispatch } = useContext(DragContext);
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: draggableItem.card,
    item: {
      type: draggableItem.card,
      data: card,
      index: cardIndex,
      listIndex: listIndex,
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: draggableItem.card,
    hover: (item: DragItem) => {
      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = cardIndex;

      // 位置不変の場合
      if (dragIndex === hoverIndex && dragListIndex === hoverListIndex) return;

      const boardId = card.boardId;
      dragDispatch({
        type: 'MOVE_CARD',
        payload: {
          dragListIndex,
          hoverListIndex,
          dragIndex,
          hoverIndex,
          boardId,
        },
      });

      item.index = hoverIndex;
      item.listIndex = hoverListIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  drag(drop(ref));

  const isSelected = () => card.id === selectedId;
  const className = `${classes.root} ${isSelected() ? classes.selected : ''} ${
    isOver ? classes.dragAndHover : ''
  }`;

  const handleClick = () => {
    isSelected() && activateInfoBoxEventAttr('shown');
    if (isSelected()) return;
    else dispatch(openInfoBox({ type: 'card', data: card }));
  };

  return (
    <Card ref={ref} onClick={handleClick} className={className}>
      <TypographyWithLimitedRows title={card.title}>
        {card.title}
      </TypographyWithLimitedRows>
    </Card>
  );
};

export default TaskCard;
