import React, { useRef } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  TextFieldProps,
  ClickAwayListener,
} from '@material-ui/core';

import { TaskBoard, TaskList, TaskCard } from 'models';
import { useAppDispatch } from 'utils/hooks';
import { createTaskBoard, updateTaskBoard } from 'store/thunks/boards';
import { createTaskList, updateTaskList } from 'store/thunks/lists';
import { createTaskCard } from 'store/thunks/cards';
import theme from 'theme';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().min(2).max(60),
});

export type FormAction =
  | { method: 'POST'; type: 'board' }
  | { method: 'POST'; type: 'list'; parent: TaskBoard }
  | { method: 'POST'; type: 'card'; parent: TaskList }
  | { method: 'PATCH'; type: 'board'; data: TaskBoard }
  | { method: 'PATCH'; type: 'list'; data: TaskList }
  | { method: 'PATCH'; type: 'card'; data: TaskCard };

type FormProps = FormAction & {
  handleClose: () => void;
} & TextFieldProps;

const TitleForm: React.FC<FormProps> = (props) => {
  const { method, type, handleClose, ...textFieldProps } = props;
  const dispatch = useAppDispatch();
  const submitRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    switch (props.method) {
      case 'POST':
        switch (props.type) {
          case 'board':
            await dispatch(createTaskBoard({ ...data }));
            break;
          case 'list':
            await dispatch(
              createTaskList({ boardId: props.parent.id, ...data })
            );
            break;
          case 'card':
            await dispatch(
              createTaskCard({
                boardId: props.parent.boardId,
                listId: props.parent.id,
                ...data,
              })
            );
            break;
        }
        break;
      case 'PATCH':
        if (!data.title) break;
        switch (props.type) {
          case 'board':
            await dispatch(updateTaskBoard({ id: props.data.id, ...data }));
            break;
          case 'list':
            await dispatch(
              updateTaskList({
                id: props.data.id,
                boardId: props.data.boardId,
                ...data,
              })
            );
            break;
          case 'card':
            break;
        }
        break;
    }
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRef.current?.click();
    }
  };

  return (
    <ClickAwayListener
      mouseEvent='onMouseDown'
      touchEvent='onTouchEnd'
      onClickAway={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
        <TextField
          id='title'
          required
          autoFocus
          fullWidth
          variant='outlined'
          placeholder='Enter a title'
          InputProps={{
            margin: 'dense',
            style: { backgroundColor: theme.palette.background.paper },
          }}
          InputLabelProps={{ margin: 'dense' }}
          helperText={errors?.title?.message || '2-60 characters'}
          error={!!errors?.title}
          {...textFieldProps}
          {...register('title')}
        />
        <input type='submit' ref={submitRef} hidden />
      </form>
    </ClickAwayListener>
  );
};

export default TitleForm;
