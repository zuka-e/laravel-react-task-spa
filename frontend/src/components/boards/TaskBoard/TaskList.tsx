import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, CardContent, Box } from '@material-ui/core';

import * as Model from 'models';
import { ScrolledBox, TypographyWithLimitedRows } from 'templates';
import { ListCardHeader } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    taskList: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
    },
  })
);

export interface TaskListProps {
  list: Model.TaskList;
  listIndex: number;
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const { list } = props;
  const classes = useStyles();

  return (
    <Card elevation={7} className={classes.taskList}>
      <ListCardHeader list={list} />

      <CardContent>
        <ScrolledBox maxHeight='90vh' mr={-0.5} pr={0.5}>
          {list.cards.map((card, i) => (
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
