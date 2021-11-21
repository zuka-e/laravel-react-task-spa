import React, { useEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  TextFieldProps,
  ClickAwayListener,
} from '@material-ui/core';

import theme from 'theme';
import { useAppDispatch } from 'utils/hooks';
import { FormAction } from 'store/slices/taskBoardSlice';
import { createTaskBoard, updateTaskBoard } from 'store/thunks/boards';
import { createTaskList, updateTaskList } from 'store/thunks/lists';
import { createTaskCard, updateTaskCard } from 'store/thunks/cards';
import { setFlash } from 'store/slices';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().min(2).max(60),
});

type FormProps = FormAction & {
  handleClose: () => void;
} & TextFieldProps;

const TitleForm: React.FC<FormProps> = (props) => {
  const { method, model, handleClose, ...textFieldProps } = props;
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

  useEffect(() => {
    if (errors?.title?.message)
      dispatch(setFlash({ type: 'error', message: errors.title.message }));
  }, [dispatch, errors.title]);

  const onSubmit = async (data: FormData) => {
    switch (method) {
      case 'POST':
        switch (model) {
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
        switch (model) {
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
            await dispatch(
              updateTaskCard({
                id: props.data.id,
                boardId: props.data.boardId,
                listId: props.data.listId,
                ...data,
              })
            );
            break;
        }
        break;
    }
    handleClose();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
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
          onFocus={handleFocus}
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
