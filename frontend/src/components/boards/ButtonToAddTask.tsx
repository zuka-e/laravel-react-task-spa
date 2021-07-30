import React, { useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  ClickAwayListener,
  Card,
  CardActions,
  Button,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import theme from 'theme';
import { FormAction, TitleForm } from '.';

const margin = theme.spacing(0.75);
const useStyles = makeStyles(() =>
  createStyles({
    root: { justifyContent: 'flex-start' },
    wrapper: {
      margin: margin,
      width: `calc(100% - ${margin * 2}px)`,
    },
    transparent: {
      backgroundColor: 'inherit',
      boxShadow: 'unset',
    },
    dim: { backgroundColor: 'rgb(0,0,0,0.1)' },
  })
);

type ButtonToAddTaskProps = FormAction & {
  transparent?: boolean;
};

const ButtonToAddTask: React.FC<ButtonToAddTaskProps> = (props) => {
  const { transparent, ...formActionType } = props;
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);

  const toggleForm = () => {
    setIsEditing(!isEditing);
  };

  const handleClickAway = () => {
    setIsEditing(false);
  };

  return (
    <ClickAwayListener
      mouseEvent='onMouseUp'
      touchEvent='onTouchEnd'
      onClickAway={handleClickAway}
    >
      {isEditing ? (
        <Card
          elevation={7}
          className={props.transparent ? classes.transparent : ''}
        >
          <CardActions style={{ display: 'block' }}>
            <TitleForm {...formActionType} handleClose={toggleForm} />
          </CardActions>
        </Card>
      ) : (
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={toggleForm}
          classes={{
            root: `${classes.root} ${props.transparent ? classes.wrapper : ''}`,
          }}
          className={props.transparent ? classes.transparent : classes.dim}
        >
          Add new {props.type}
        </Button>
      )}
    </ClickAwayListener>
  );
};

export default ButtonToAddTask;
