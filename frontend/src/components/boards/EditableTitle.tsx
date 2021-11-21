import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, TextFieldProps } from '@material-ui/core';

import { FormAction } from 'store/slices/taskBoardSlice';
import { TitleForm } from '.';

const maxRow = 1;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: -theme.spacing(0.75),
    },
    title: {
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': maxRow,
      overflow: 'hidden',
      fontWeight: 'bold',
    },
    notchedOutline: { border: 'none' },
    multilineDense: {
      padding: theme.spacing(0.75),
    },
    helperTextDense: {
      marginTop: '1px',
      marginLeft: theme.spacing(1),
    },
    marginForhelperText: {
      marginBottom: theme.spacing(2.5),
    },
  })
);

type EditableTitleProps = FormAction & {
  inputStyle?: string;
  disableMargin?: boolean;
  rowsMax?: number;
} & TextFieldProps;

const EditableTitle: React.FC<EditableTitleProps> = (props) => {
  const { inputStyle, disableMargin, rowsMax, ...formProps } = props;
  const { method, model, variant, ...textFieldProps } = formProps;
  const defaultValue = props.method === 'PATCH' ? props.data.title : '';
  const classes = useStyles();
  const [editing, setEditing] = useState(false);

  const handleOpenForm = () => {
    setEditing(true);
  };

  const handleCloseForm = () => {
    setEditing(false);
  };

  return editing ? (
    <TitleForm
      handleClose={handleCloseForm}
      classes={{ root: classes.root }}
      defaultValue={defaultValue || ''}
      multiline
      InputProps={{
        classes: {
          root: props.inputStyle || classes.title,
          multiline: classes.multilineDense,
        },
      }}
      FormHelperTextProps={{
        margin: 'dense',
        classes: { marginDense: classes.helperTextDense },
      }}
      {...formProps}
    />
  ) : (
    <TextField
      classes={{ root: classes.root }}
      fullWidth
      value={defaultValue || ''} // `defaultValue`の場合初レンダリング時の値を固定
      inputProps={{ title: defaultValue }}
      multiline
      rowsMax={props.rowsMax || maxRow}
      variant='outlined'
      InputProps={{
        onClick: handleOpenForm,
        classes: {
          root: props.disableMargin ? '' : classes.marginForhelperText,
          multiline: classes.multilineDense,
          inputMultiline: props.inputStyle || classes.title,
          notchedOutline: classes.notchedOutline,
        },
      }}
      {...textFieldProps}
    />
  );
};

export default EditableTitle;
