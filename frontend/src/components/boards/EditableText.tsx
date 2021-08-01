import React, { useState } from 'react';

import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, TextFieldProps } from '@material-ui/core';

import { FormAction } from 'store/slices/taskBoardSlice';
import { TextForm } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: { whiteSpace: 'pre-wrap' },
    multilineDense: { padding: theme.spacing(0.75) },
    helperTextDense: {
      marginTop: '1px',
      marginLeft: theme.spacing(1),
    },
    marginForhelperText: { marginBottom: theme.spacing(2.5) },
  })
);

type EditableTextProps = FormAction & {
  schema: yup.ObjectSchema<ObjectShape>;
  defaultValue?: string;
  disableMargin?: boolean;
  inputStyle?: string;
} & TextFieldProps;

const EditableText: React.FC<EditableTextProps> = (props) => {
  const { defaultValue, disableMargin, inputStyle, ...formProps } = props;
  const { method, type, schema, ...textFieldProps } = formProps;
  const classes = useStyles();
  const [editing, setEditing] = useState(false);

  const placeholder = 'Enter the text';
  const rows = 15;

  const handleOpen = () => setEditing(true);
  const handleClose = () => setEditing(false);

  return editing ? (
    <TextForm
      handleClose={handleClose}
      placeholder={placeholder}
      defaultValue={defaultValue || ''}
      multiline
      rows={rows}
      InputProps={{
        classes: {
          root: props.inputStyle || classes.text,
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
      fullWidth
      placeholder={placeholder}
      value={defaultValue || ''}
      inputProps={{ title: defaultValue }}
      multiline
      rows={rows}
      variant='outlined'
      InputProps={{
        onClick: handleOpen,
        classes: {
          root: props.disableMargin ? '' : classes.marginForhelperText,
          multiline: classes.multilineDense,
          inputMultiline: props.inputStyle || classes.text,
        },
      }}
      {...textFieldProps}
    />
  );
};

export default EditableText;
