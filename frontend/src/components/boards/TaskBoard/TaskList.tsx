import React, { useContext, useState } from 'react';

import { useDrop } from 'react-dnd';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Grid, Chip } from '@material-ui/core';

import * as Model from 'models';
import { useAppSelector } from 'utils/hooks';
import { LabeledSelect, ScrolledDiv } from 'templates';
import { ListCardHeader, TaskCard } from '.';
import { ButtonToAddTask } from '..';
import { DragContext, DragItem, draggableItem } from '../DragContext';

const borderWidth = '2px';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: theme.shadows[7],
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
    selected: {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.secondary.dark,
      border: borderWidth + ' solid ' + theme.palette.primary.main,
      '& > .listWrapper': { margin: `-${borderWidth}` },
    },
    disablePadding: {
      padding: `0px ${theme.spacing(1)}px`,
    },
    cardItemBox: {
      maxHeight: '90vh',
      marginRight: theme.spacing(-0.5),
      paddingRight: theme.spacing(0.5),
      '& > .cardItem': {
        marginBottom: theme.spacing(1),
      },
    },
  })
);

const cardFilter = {
  ALL: 'All',
  TODO: 'Incompleted',
  DONE: 'Completed',
} as const;

type FilterName = typeof cardFilter[keyof typeof cardFilter];

type TaskListProps = {
  list: Model.TaskList;
  listIndex: number;
};

const TaskList: React.FC<TaskListProps> = (props) => {
  const { list, listIndex } = props;
  const classes = useStyles();
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const [filterValue, setfilterValue] = useState<FilterName>(cardFilter.ALL);
  const { dragDispatch } = useContext(DragContext);

  const [, drop] = useDrop({
    accept: draggableItem.card,
    hover: (item: DragItem) => {
      const dragListIndex = item.listIndex;
      const hoverListIndex = listIndex;
      const dragIndex = item.index;
      const hoverIndex = 0;

      if (dragListIndex === hoverListIndex) return;

      const boardId = list.boardId;
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
  });

  const isSelected = () => list.id === selectedId;
  const rootClass = `${classes.root} ${isSelected() ? classes.selected : ''}`;

  const filteredCards = list.cards.filter((card) => {
    if (filterValue === cardFilter.TODO) return !card.done;
    else if (filterValue === cardFilter.DONE) return card.done;
    else return true;
  });

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setfilterValue(event.target.value as FilterName); // unknown型から変換
  };

  const handleDragEnd = () => {
    // API request
  };

  return (
    <Card ref={drop} className={rootClass} onDragEnd={handleDragEnd}>
      <div className='listWrapper'>
        <ListCardHeader list={list} />

        <CardActions>
          <Grid container alignItems='center' justify='space-between'>
            <Grid item>
              <LabeledSelect
                label='Filter'
                options={cardFilter}
                value={filterValue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <Chip label={filteredCards.length} title='タスク数' />
            </Grid>
          </Grid>
        </CardActions>

        <CardContent className={classes.disablePadding}>
          <ScrolledDiv className={classes.cardItemBox}>
            {filteredCards.map((card, i) => (
              <div key={card.id} className='cardItem'>
                <TaskCard card={card} cardIndex={i} listIndex={listIndex} />
              </div>
            ))}
          </ScrolledDiv>
        </CardContent>

        <ButtonToAddTask method='POST' type='card' parent={list} transparent />
      </div>
    </Card>
  );
};

export default TaskList;
