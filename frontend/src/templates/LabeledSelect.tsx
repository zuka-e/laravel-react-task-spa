import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  SelectProps,
  MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    label: {
      fontWeight: 'bold',
      '&.inputLabel-default.Mui-focused': {
        color: theme.palette.primary.contrastText,
      },
      '&.inputLabel-primary.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '&.inputLabel-secondary.Mui-focused': {
        color: theme.palette.secondary.main,
      },
    },
    input: {
      '&.input-default:after': {
        borderColor: theme.palette.primary.contrastText,
      },
      '&.input-primary:after': {
        borderColor: theme.palette.primary.main,
      },
      '&.input-secondary:after': {
        borderColor: theme.palette.secondary.main,
      },
    },
  })
);

type LabeledSelectProps = {
  label: string;
  options: object;
} & SelectProps;

const LabeledSelect: React.FC<LabeledSelectProps> = (props) => {
  const { label, options, color, value, onChange, ...selectProps } = props;
  const classes = useStyles();

  const htmlId = 'filter';
  const labelId = htmlId + '-label';

  return (
    <FormControl classes={{ root: classes.root }}>
      <InputLabel
        id={labelId}
        classes={{ focused: classes.label }}
        className={`inputLabel-${color || 'default'}`}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={htmlId}
        value={value}
        onChange={onChange}
        input={
          <Input
            classes={{ underline: classes.input }}
            className={`input-${color || 'default'}`}
          />
        }
        {...selectProps}
      >
        {Object.values(options).map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LabeledSelect;
