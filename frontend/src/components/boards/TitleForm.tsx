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
import { createTaskBoard } from 'store/thunks/boards';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().min(2).max(20),
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

  const onSubmit = (data: FormData) => {
    switch (method) {
      case 'POST':
        switch (type) {
          case 'board':
            dispatch(createTaskBoard({ ...data }));
            break;
          case 'list':
            break;
          case 'card':
            break;
        }
        break;
      case 'PATCH':
        switch (type) {
          case 'board':
            break;
          case 'list':
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
          InputProps={{ margin: 'dense' }}
          InputLabelProps={{ margin: 'dense' }}
          helperText={errors?.title?.message || '2-20 characters'}
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
