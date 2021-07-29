import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

import { FormAction, TitleForm } from '.';

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
};

const EditableTitle: React.FC<EditableTitleProps> = (props) => {
  const { inputStyle, disableMargin, rowsMax, ...formActionType } = props;
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);

  const defaultValue = props.method === 'PATCH' ? props.data.title : '';

  const handleOpenForm = () => {
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
  };

  return isEditing ? (
    <TitleForm
      {...formActionType}
      handleClose={handleCloseForm}
      classes={{ root: classes.root }}
      defaultValue={defaultValue}
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
    />
  ) : (
    <TextField
      classes={{ root: classes.root }}
      fullWidth
      defaultValue={defaultValue}
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
    />
  );
};

export default EditableTitle;
