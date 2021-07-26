import React, { useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  ClickAwayListener,
  Card,
  CardActions,
  Button,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { FormAction, TitleForm } from '.';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      justifyContent: 'flex-start',
      backgroundColor: 'rgb(0,0,0,0.1)',
    },
  })
);

type ButtonToAddTaskProps = FormAction;

const ButtonToAddTask: React.FC<ButtonToAddTaskProps> = (props) => {
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
        <Card elevation={7}>
          <CardActions style={{ display: 'block' }}>
            <TitleForm {...props} handleClose={toggleForm} />
          </CardActions>
        </Card>
      ) : (
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={toggleForm}
          classes={{ root: classes.button }}
        >
          Add new {props.type}
        </Button>
      )}
    </ClickAwayListener>
  );
};

export default ButtonToAddTask;
