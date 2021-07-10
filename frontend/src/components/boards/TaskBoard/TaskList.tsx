import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, CardContent, Box, Grid, Typography } from '@material-ui/core';

import * as Model from 'models';
import { useAppSelector } from 'utils/hooks';
import { LabeledSelect, ScrolledBox } from 'templates';
import { ListCardHeader, TaskCard } from '.';

const borderWidth = '2px';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
    selected: {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.secondary.dark,
      border: borderWidth + ' solid ' + theme.palette.primary.main,
      '& > .listWrapper': { margin: `-${borderWidth}` },
    },
  })
);

const cardFilter = {
  ALL: 'All',
  TODO: 'Incompleted',
  DONE: 'Completed',
} as const;

type FilterName = typeof cardFilter[keyof typeof cardFilter];

export type TaskListProps = {
  list: Model.TaskList;
  listIndex: number;
};

const TaskList: React.FC<TaskListProps> = (props) => {
  const { list, listIndex } = props;
  const { root, selected } = useStyles();
  const selectedId = useAppSelector((state) => state.boards.infoBox.data?.id);
  const [filterValue, setfilterValue] = useState<FilterName>(cardFilter.ALL);

  const isSelected = () => list.id === selectedId;
  const className = `${root} ${isSelected() && selected}`;

  const filteredCards = list.cards.filter((card) => {
    if (filterValue === cardFilter.TODO) return !card.done;
    else if (filterValue === cardFilter.DONE) return card.done;
    else return true;
  });

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setfilterValue(event.target.value as FilterName); // unknown型から変換
  };

  return (
    <Card elevation={7} className={className}>
      <div className='listWrapper'>
        <ListCardHeader list={list} />

        <Box px={1}>
          <Grid container alignItems='center' justify='space-between'>
            <Grid item>
              <LabeledSelect
                color='contrastS'
                label='Filter'
                options={cardFilter}
                selectedValue={filterValue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <Box p={1}>
                <Typography title='タスク数'>{filteredCards.length}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <CardContent>
          <ScrolledBox maxHeight='90vh' mr={-0.5} pr={0.5}>
            {filteredCards.map((card, i) => (
              <Box key={card.id} mb={1}>
                <TaskCard card={card} cardIndex={i} listIndex={listIndex} />
              </Box>
            ))}
          </ScrolledBox>
        </CardContent>

        {/* <AddTaskButton card id={list.id} />*/}
      </div>
    </Card>
  );
};

export default TaskList;
