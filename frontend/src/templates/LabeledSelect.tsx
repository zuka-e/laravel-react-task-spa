import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Input,
  Select,
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
      '&.inputLabelDefault.Mui-focused': {
        color: theme.palette.primary.contrastText,
      },
      '&.inputLabelPrimary.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '&.inputLabelSecondary.Mui-focused': {
        color: theme.palette.secondary.main,
      },
    },
    input: {
      '&:after': {
        borderColor: theme.palette.primary.contrastText,
      },
      '&.inputDefault:after': {
        color: theme.palette.primary.contrastText,
      },
      '&.inputPrimary:after': {
        color: theme.palette.primary.main,
      },
      '&.inputSecondary:after': {
        color: theme.palette.secondary.main,
      },
    },
  })
);

type LabeledSelectProps = {
  color?: 'primary' | 'secondary';
  label: string;
  options: object;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
};

const LabeledSelect: React.FC<LabeledSelectProps> = (props) => {
  const { color, label, options, selectedValue, onChange } = props;
  const classes = useStyles();

  const htmlId = 'filter';
  const labelId = htmlId + '-label';

  return (
    <FormControl classes={{ root: classes.root }}>
      <InputLabel
        id={labelId}
        classes={{ focused: classes.label }}
        className={`inputLabel${color || 'Default'}`}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={htmlId}
        value={selectedValue}
        onChange={onChange}
        input={
          <Input
            classes={{ underline: classes.input }}
            className={`input${color || 'Default'}`}
          />
        }
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
