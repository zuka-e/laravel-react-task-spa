import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';

import theme from 'theme';
import * as Model from 'models';
import { TypographyWithLimitedRows } from 'templates';

const defaultPadding = theme.spacing(1.5);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: theme.shadows[1],
      cursor: 'pointer',
      '&:hover': { opacity: 0.8 },
      '& > p': { padding: defaultPadding },
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

  return (
    <Card className={classes.root}>
      <TypographyWithLimitedRows color='textSecondary' title={card.title}>
        {card.title}
      </TypographyWithLimitedRows>
    </Card>
  );
};

export default TaskCard;
