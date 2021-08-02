import React, { useRef } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import {
  TextField,
  TextFieldProps,
  ClickAwayListener,
} from '@material-ui/core';

import theme from 'theme';
import { useAppDispatch } from 'utils/hooks';
import { FormAction } from 'store/slices/taskBoardSlice';
import { updateTaskCard } from 'store/thunks/cards';
import { updateTaskList } from 'store/thunks/lists';

type FormData = {
  [key: string]: string;
};

type FormProps = FormAction & {
  schema: yup.ObjectSchema<ObjectShape>;
  handleClose: () => void;
} & TextFieldProps;

const TextForm: React.FC<FormProps> = (props) => {
  const { schema, method, type, handleClose, ...textFieldProps } = props;
  const property = Object.keys(schema.fields)[0];
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
            break;
          case 'list':
            break;
          case 'card':
            break;
        }
        break;
      case 'PATCH':
        switch (props.type) {
          case 'board':
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
                listId: props.data.listId,
                boardId: props.data.boardId,
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
          id={property}
          multiline
          autoFocus
          onFocus={handleFocus}
          fullWidth
          variant='outlined'
          placeholder='Enter the text'
          InputProps={{
            margin: 'dense',
            style: { backgroundColor: theme.palette.background.paper },
          }}
          InputLabelProps={{ margin: 'dense' }}
          helperText={errors?.property?.message}
          error={!!errors?.property}
          {...textFieldProps}
          {...register(property)}
        />
        <input type='submit' ref={submitRef} hidden />
      </form>
    </ClickAwayListener>
  );
};

export default TextForm;
