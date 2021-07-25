import React from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, CardActions } from '@material-ui/core';

import { TaskBoard, TaskList, TaskCard } from 'models';
import { useAppDispatch } from 'utils/hooks';
import { createTaskBoard } from 'store/thunks/boards';

type FormData = {
  title: string;
};

const schema = yup.object().shape({
  title: yup.string().required().min(2).max(20),
});

export type FormAction =
  | { method: 'POST'; type: 'board' }
  | { method: 'POST'; type: 'list'; parent: TaskBoard }
  | { method: 'POST'; type: 'card'; parent: TaskList }
  | { method: 'PATCH'; type: 'board'; data: TaskBoard }
  | { method: 'PATCH'; type: 'list'; data: TaskList }
  | { method: 'PATCH'; type: 'card'; data: TaskCard };

type FormProps = FormAction & {
  currentValue?: string;
  handleClose: () => void;
};

const TitleForm: React.FC<FormProps> = (props) => {
  const { method, type, currentValue, handleClose } = props;
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (currentValue === data.title) {
      handleClose();
      return;
    }
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardActions disableSpacing>
        <TextField
          id='title'
          autoFocus
          fullWidth
          variant='outlined'
          placeholder='Enter a title'
          InputProps={{ margin: 'dense' }}
          label={currentValue}
          InputLabelProps={{ margin: 'dense' }}
          {...register('title')}
          helperText={errors?.title?.message || '2-20 characters'}
          error={!!errors?.title}
        />
      </CardActions>
    </form>
  );
};
export default TitleForm;
