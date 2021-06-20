import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, CardContent, Box } from '@material-ui/core';

import * as Model from 'models';
import {
  LabeledSelect,
  ScrolledBox,
  TypographyWithLimitedRows,
} from 'templates';
import { ListCardHeader } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    taskList: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
    },
  })
);

export const cardFilter = {
  ALL: 'All',
  TODO: 'Incompleted',
  DONE: 'Completed',
} as const;

type CardFilter = typeof cardFilter[keyof typeof cardFilter];
export interface TaskListProps {
  list: Model.TaskList;
  listIndex: number;
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const { list } = props;
  const classes = useStyles();
  const [filterValue, setfilterValue] = useState<CardFilter>(cardFilter.ALL);

  const filteredCards = list.cards.filter((card) => {
    if (filterValue === cardFilter.TODO) return !card.done;
    else if (filterValue === cardFilter.DONE) return card.done;
    else return true;
  });

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setfilterValue(event.target.value as CardFilter); // unknown型から変換
  };

  return (
    <Card elevation={7} className={classes.taskList}>
      <ListCardHeader list={list} />

      <Box mx={1}>
        <LabeledSelect
          label='Filter'
          options={cardFilter}
          selectedValue={filterValue}
          onChange={handleChange}
        />
      </Box>

      <CardContent>
        <ScrolledBox maxHeight='90vh' mr={-0.5} pr={0.5}>
          {filteredCards.map((card, i) => (
            <Box key={card.id} mb={1}>
              <Card elevation={2}>
                <CardContent>
                  <TypographyWithLimitedRows>
                    {card.title + card.title}
                  </TypographyWithLimitedRows>
                  {/* <TaskCard card={card} index={i} listIndex={listIndex} /> */}
                </CardContent>
              </Card>
            </Box>
          ))}
        </ScrolledBox>
      </CardContent>
      {/* <AddTaskButton card id={list.id} />*/}
    </Card>
  );
};

export default TaskList;
